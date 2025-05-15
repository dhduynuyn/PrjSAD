import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterHeader from './Chapter/ChapterHeader';
import ChapterContent from './Chapter/ChapterContent';
import ChapterNavigation from './Chapter/ChapterNavigation';
import ChapterSettings from './Chapter/ChapterSettings';
import { getChapterDetailsApi, recordChapterViewApi } from '../api/chapterApi'; // Giả sử có API
import { FiLoader } from 'react-icons/fi';

// Hàm lấy cài đặt từ localStorage
const loadSettingsFromStorage = () => {
  try {
    const storedSettings = localStorage.getItem('chapterReaderSettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
  }
  // Trả về mặc định nếu không có hoặc lỗi
  return {
    fontSize: 18,
    lineHeight: 1.8,
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF', // Mặc định nền trắng
  };
};

// Hàm lưu cài đặt vào localStorage
const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem('chapterReaderSettings', JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};


export default function ChapterPage() {
  const { storySlug, chapterSlug } = useParams();
  const navigate = useNavigate();

  const [chapterDetails, setChapterDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [readerSettings, setReaderSettings] = useState(loadSettingsFromStorage());


  const fetchChapter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching chapter: ${storySlug}/${chapterSlug}`);
    try {
      // Thay bằng API thật ---
      // const data = await getChapterDetailsApi(storySlug, chapterSlug);
      // Giả lập API response
      const data = await new Promise(resolve => setTimeout(() => resolve({
        story: {
          title: `Truyện ${storySlug.replace(/-/g, ' ')}`,
          slug: storySlug,
        },
        chapter: {
          title: `Chương ${chapterSlug.split('-').pop()}: Tên Chương Giả Lập`,
          content: `<p>Đây là nội dung của chương truyện. <strong>Rất hấp dẫn!</strong></p><p>Nội dung có thể dài và có nhiều đoạn văn.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`.repeat(3), // Lặp lại nội dung cho dài
          updatedAtISO: new Date().toISOString(),
          views: Math.floor(Math.random() * 1000) + 50, // Lượt xem giả
          // Thông tin chương trước/sau
          prevChapterSlug: parseInt(chapterSlug.split('-').pop()) > 1 ? `chuong-${parseInt(chapterSlug.split('-').pop()) - 1}` : null,
          nextChapterSlug: `chuong-${parseInt(chapterSlug.split('-').pop()) + 1}`, // Giả sử luôn có chương sau để test
        }
      }), 800));

      setChapterDetails(data);

      // Ghi nhận lượt xem (không chặn hiển thị nếu lỗi)
      recordChapterViewApi(storySlug, chapterSlug).catch(err => console.warn("Failed to record view:", err));

    } catch (err) {
      console.error("Failed to fetch chapter:", err);
      setError("Không thể tải nội dung chương. Vui lòng thử lại.");
      setChapterDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [storySlug, chapterSlug]);

  useEffect(() => {
    fetchChapter();
    window.scrollTo(0, 0); // Cuộn lên đầu khi đổi chương
  }, [fetchChapter]); // Phụ thuộc vào fetchChapter (đã bao gồm storySlug, chapterSlug)


  // Xử lý thay đổi cài đặt
  const handleSettingsChange = (newSettings) => {
    setReaderSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  // Áp dụng màu nền cho body hoặc wrapper
  useEffect(() => {
     const body = document.body;
     const originalBackgroundColor = body.style.backgroundColor;
     body.style.backgroundColor = readerSettings.backgroundColor;

     // Xác định màu chữ dựa trên độ sáng của nền
     const isDarkBackground = (bgColor) => {
         if (!bgColor) return false;
         const color = bgColor.substring(1); // Bỏ #
         const r = parseInt(color.substring(0, 2), 16);
         const g = parseInt(color.substring(2, 4), 16);
         const b = parseInt(color.substring(4, 6), 16);
         // Ngưỡng độ sáng (0-255), có thể điều chỉnh
         return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
     };

     if (isDarkBackground(readerSettings.backgroundColor)) {
         body.classList.add('text-light-override'); // class để set màu chữ sáng
         body.classList.remove('text-dark-override');
     } else {
         body.classList.add('text-dark-override'); // class để set màu chữ tối
         body.classList.remove('text-light-override');
     }


     return () => {
         body.style.backgroundColor = originalBackgroundColor; // Reset khi unmount
         body.classList.remove('text-light-override', 'text-dark-override');
     };
  }, [readerSettings.backgroundColor]);


  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
       <div className="container mx-auto px-4 py-10 text-center text-red-600 bg-red-100 p-6 rounded border border-red-300">
         {error}
       </div>
    );
  }

  if (!chapterDetails || !chapterDetails.chapter) {
     return (
       <div className="container mx-auto px-4 py-10 text-center text-gray-500">
         Không tìm thấy nội dung chương.
       </div>
    );
  }

  const { story, chapter } = chapterDetails;

  return (
    <div className="min-h-screen py-6" style={{ backgroundColor: readerSettings.backgroundColor}}>
      <div className="container mx-auto max-w-3xl px-4"> 
        <ChapterHeader
          storyTitle={story.title}
          storySlug={story.slug}
          chapterTitle={chapter.title}
          updatedAtISO={chapter.updatedAtISO}
          views={chapter.views}
        />
        <ChapterContent
            content={chapter.content}
            textSettings={readerSettings}
        />
        <ChapterNavigation
          storySlug={story.slug}
          prevChapterSlug={chapter.prevChapterSlug}
          nextChapterSlug={chapter.nextChapterSlug}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>
      <ChapterSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={readerSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

// ----- Cần tạo API functions trong src/api/chapterApi.js -----
// Ví dụ:
// export const getChapterDetailsApi = async (storySlug, chapterSlug) => {
//   console.log(`API Call: getChapterDetails for ${storySlug}/${chapterSlug}`);
//   // await fetch(...)
//   // Trả về object: { story: { title, slug }, chapter: { title, content, updatedAtISO, views, prevChapterSlug, nextChapterSlug } }
//   return { /* ... */ };
// };
// export const recordChapterViewApi = async (storySlug, chapterSlug) => {
//   console.log(`API Call: recordChapterView for ${storySlug}/${chapterSlug}`);
//   // await fetch(...) POST method, không cần đợi kết quả
// };

// --- Thêm CSS vào file global (ví dụ: src/index.css) để override màu chữ ---
// .text-light-override .prose {
//     --tw-prose-body: theme('colors.gray.200');
//     --tw-prose-headings: theme('colors.white');
//     --tw-prose-lead: theme('colors.gray.300');
//     --tw-prose-links: theme('colors.sky.400');
//     --tw-prose-bold: theme('colors.gray.100');
//     /* ... các biến màu khác của prose cho nền tối ... */
// }
// .text-dark-override .prose {
//      --tw-prose-body: theme('colors.gray.700');
//      --tw-prose-headings: theme('colors.black');
//      /* ... các biến màu khác của prose cho nền sáng ... */
// }