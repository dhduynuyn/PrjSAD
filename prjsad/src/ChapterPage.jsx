import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterHeader from './Chapter/ChapterHeader';
import ChapterContent from './Chapter/ChapterContent';
import ChapterNavigation from './Chapter/ChapterNavigation';
import ChapterSettings from './Chapter/ChapterSetting';
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
  return {
    fontSize: 18,
    lineHeight: 1.8,
    fontFamily: 'inherit',
    backgroundColor: '#000000',
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

// Gọi API thật
const getChapterDetailsApi = async (storySlug, chapterSlug) => {
  console.log("✅ Stories Slug:", storySlug);
  console.log("✅ chapterSlug Slug:", chapterSlug);
  const storyRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}`);

  if (!storyRes.ok) {
    throw new Error("API trả về lỗi.");
  }

  const story = await storyRes.json();
  const chapters = story.chapters

  console.log("✅ Stories:", story)
  console.log("✅ Stories Chapters:", chapters)

  const chapterIndex = chapters.findIndex(chap => parseInt(chap.chapterid) === parseInt(chapterSlug));
  if (chapterIndex === -1) throw new Error("Không tìm thấy chương.");

  const chapter = chapters[chapterIndex];
  const prevChapterSlug = chapterIndex > 0 ? chapters[chapterIndex - 1].slug : null;
  const nextChapterSlug = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1].slug : null;

  return {
    story: {
      id: story.id,
      title: story.title,
      slug: story.id,
    },
    chapter: {
      title: chapter.title,
      content: chapter.content,
      updatedAtISO: chapter.created_at,
      // views: chapter.views,
      prevChapterSlug,
      nextChapterSlug
    }
  };
};

// Gọi API ghi nhận lượt xem
const recordChapterViewApi = async (storySlug, chapterSlug) => {
  try {
    await fetch(`http://localhost:5000/stories/slug/${storySlug}/chapters/${chapterSlug}/view`, {
      method: 'POST',
    });
  } catch (err) {
    console.warn("Failed to record view:", err);
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
      const data = await getChapterDetailsApi(storySlug, chapterSlug);
      setChapterDetails(data);
      recordChapterViewApi(storySlug, chapterSlug);
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
    window.scrollTo(0, 0);
  }, [fetchChapter]);

  const handleSettingsChange = (newSettings) => {
    setReaderSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  useEffect(() => {
    const body = document.body;
    const originalBackgroundColor = body.style.backgroundColor;
    body.style.backgroundColor = readerSettings.backgroundColor;

    const isDarkBackground = (bgColor) => {
      if (!bgColor) return false;
      const color = bgColor.substring(1);
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    };

    if (isDarkBackground(readerSettings.backgroundColor)) {
      body.classList.add('text-light-override');
      body.classList.remove('text-dark-override');
    } else {
      body.classList.add('text-dark-override');
      body.classList.remove('text-light-override');
    }

    return () => {
      body.style.backgroundColor = originalBackgroundColor;
      body.classList.remove('text-light-override', 'text-dark-override');
    };
  }, [readerSettings.backgroundColor]);

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
    <div className="min-h-screen py-6" style={{ backgroundColor: readerSettings.backgroundColor }}>
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
