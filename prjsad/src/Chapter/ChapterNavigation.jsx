import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiList, FiSettings } from 'react-icons/fi';

export default function ChapterNavigation({
  storySlug,
  prevChapterSlug,
  nextChapterSlug,
  onOpenSettings // Hàm mở modal/panel settings
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-3">
      {/* Nút Chương Trước */}
      <Link
        to={prevChapterSlug ? `/truyen/${storySlug}/${prevChapterSlug}` : '#'}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ${
          prevChapterSlug
            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
        }`}
        disabled={!prevChapterSlug}
        onClick={(e) => !prevChapterSlug && e.preventDefault()} // Ngăn link nếu không có chương trước
      >
        <FiChevronLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Chương trước</span>
      </Link>

      {/* Nút Danh sách chương */}
      <Link
        to={`/truyen/${storySlug}#listChapters`} // Link về trang chi tiết truyện và scroll đến tab chương
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 dark:hover:bg-gray-500"
      >
        <FiList className="w-5 h-5" />
        <span className="hidden sm:inline">DS. Chương</span>
      </Link>

      {/* Nút Chương Sau */}
      <Link
        to={nextChapterSlug ? `/truyen/${storySlug}/${nextChapterSlug}` : '#'}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ${
          nextChapterSlug
            ? 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700'
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
        }`}
        disabled={!nextChapterSlug}
        onClick={(e) => !nextChapterSlug && e.preventDefault()} // Ngăn link nếu không có chương sau
      >
         <span className="hidden sm:inline">Chương sau</span>
        <FiChevronRight className="w-5 h-5" />
      </Link>

      {/* Nút Cài đặt (Tùy chọn) */}
      {onOpenSettings && (
        <button
            onClick={onOpenSettings}
            title="Cài đặt hiển thị"
            className="sm:ml-auto p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <FiSettings className="w-5 h-5"/>
            <span className="sr-only">Cài đặt</span>
        </button>
      )}
    </div>
  );
}