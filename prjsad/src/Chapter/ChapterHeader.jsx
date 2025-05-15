import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';


const formatRelativeTime = (isoTimeString) => {
    if (!isoTimeString) return '';
    const date = new Date(isoTimeString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return Math.floor(seconds) + " giây trước";
};

export default function ChapterHeader({ storyTitle, storySlug, chapterTitle, updatedAtISO, views }) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        <Link to={`/truyen/${storySlug}`} className="hover:text-sky-600 dark:hover:text-sky-400">
          {storyTitle}
        </Link>
      </nav>
      {/* Tên chương */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {chapterTitle}
      </h1>
      {/* Thông tin meta */}
      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
        {updatedAtISO && (
          <span>Cập nhật: {formatRelativeTime(updatedAtISO)}</span>
        )}
        {views !== undefined && views !== null && (
          <span className="flex items-center gap-1">
            <FiEye className="w-3.5 h-3.5" /> {views.toLocaleString()} lượt xem
          </span>
        )}
      </div>
    </div>
  );
}