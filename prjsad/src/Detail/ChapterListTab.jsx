import React from 'react';
import { Link } from 'react-router-dom';

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

export default function ChapterListTab({ chapters = [], storySlug }) {

  if (chapters.length === 0) {
    return <p className="py-4 text-center text-gray-500 dark:text-gray-400">Chưa có chương nào.</p>;
  }

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-1 pr-2"> 
      {chapters.map((chapter, index) => (
        <Link
          key={chapter.slug || index}
          to={`/truyen/${storySlug}/${chapter.slug}`}
          className="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <span className="text-sm text-gray-800 dark:text-gray-200 truncate pr-4" title={chapter.name}>
            {chapter.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {formatRelativeTime(chapter.updatedAtISO)}
          </span>
        </Link>
      ))}
    </div>
  );
}