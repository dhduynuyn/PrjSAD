// src/components/StoryActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBookmark, FiBookOpen, FiStar, FiAlertCircle } from 'react-icons/fi';

export default function StoryActions({
  storySlug,
  firstChapterSlug,
  latestChapterSlug,
  isFavorited,
  isBookmarked,
  onFavoriteToggle, // Hàm xử lý khi nhấn Yêu thích
  onBookmarkToggle, // Hàm xử lý khi nhấn Theo dõi
  onReport,         // Hàm xử lý khi nhấn Báo lỗi
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Nút Yêu thích */}
      <button
        onClick={onFavoriteToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
          isFavorited
            ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
            : 'bg-white text-pink-500 border-pink-500 hover:bg-pink-50 dark:bg-gray-700 dark:text-pink-400 dark:border-pink-400 dark:hover:bg-gray-600'
        }`}
      >
        <FiHeart className="w-4 h-4"/> {isFavorited ? 'Đã thích' : 'Yêu thích'}
      </button>

      {/* Nút Đọc từ đầu */}
       {firstChapterSlug && (
         <Link
           to={`/truyen/${storySlug}/${firstChapterSlug}`}
           className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
         >
           <FiBookOpen className="w-4 h-4"/> Đọc từ đầu
         </Link>
       )}

       {/* Nút Đọc mới nhất */}
       {latestChapterSlug && (
          <Link
            to={`/truyen/${storySlug}/${latestChapterSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-green-500 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiStar className="w-4 h-4"/> Đọc tập mới
          </Link>
       )}

      {/* Nút Theo dõi */}
      <button
        onClick={onBookmarkToggle}
         className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
          isBookmarked
            ? 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700'
            : 'bg-white text-sky-600 border-sky-600 hover:bg-sky-50 dark:bg-gray-700 dark:text-sky-400 dark:border-sky-500 dark:hover:bg-gray-600'
        }`}
      >
        <FiBookmark className="w-4 h-4"/> {isBookmarked ? 'Đang theo dõi' : 'Theo dõi'}
      </button>

      {/* Nút Báo lỗi */}
       <button
        onClick={onReport}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-gray-600 bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <FiAlertCircle className="w-4 h-4"/> Báo lỗi
      </button>
    </div>
  );
}