import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterHeader from './Chapter/ChapterHeader';
import ChapterContent from './Chapter/ChapterContent';
//import ChapterNavigation from './Chapter/ChapterNavigation';
//import ChapterSettings from './Chapter/ChapterSetting';
//import { getChapterDetailsApi, recordChapterViewApi } from '../api/chapterApi'; // Giả sử có API
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

  try {
    // GIẢ LẬP DỮ LIỆU THẬT
    const data = await new Promise(resolve => setTimeout(() => resolve({
      story: {
        title: `Truyện ${storySlug.replace(/-/g, ' ')}`,
        slug: storySlug,
      },
      chapter: {
        title: `Chương 1: Trọng Sinh`,
        content: `
<p>Khương Dao trọng sinh rồi.</p>
<p>Cô ngồi xổm trên bờ ruộng, nhìn vào bóng mình phản chiếu dưới dòng suối trong.</p>
<p>Trong nước phản chiếu hình ảnh của một bé gái khoảng bảy, tám tuổi, đôi mắt to tròn long lanh, khuôn mặt vẫn còn chút bầu bĩnh trẻ con, nhưng có thể thấy rõ, các nét trên khuôn mặt cô bé rất thanh tú và xinh đẹp.</p>
<p>Dù mặc quần áo vải thô, nhưng cả người cô bé được chăm chút rất gọn gàng sạch sẽ, quần áo không có lỗ thủng, chắp vá nào, tóc được tết thành hai bím đuôi sam bằng dây màu, cổ đeo một chiếc khóa bạc bình an, mỗi khi đi lại, trang sức bạc va chạm tạo thành âm thanh leng keng, vừa nhìn đã biết là đứa trẻ được chăm sóc kỹ lưỡng.</p>
<p>Cô có chút không thể tin nổi, vốc nước lên vỗ vào mặt mình.</p>
<p>Nước suối mùa xuân vẫn còn chút lạnh, thấm vào da, khiến người ta tỉnh táo ngay lập tức.</p>
<p>Cô chớp chớp mắt, đây không phải là mơ.</p>
`
      }
    }), 1000)); // Delay 1 giây mô phỏng gọi API

    setChapterDetails(data);
  } catch (err) {
    setError('Không thể tải nội dung chương.');
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