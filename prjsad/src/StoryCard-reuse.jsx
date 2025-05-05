import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiBookmark } from 'react-icons/fi';

const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number;
  }
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  const suffixNum = Math.floor((('' + number).length - 1) / 3);
  let shortValue = parseFloat((suffixNum !== 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(2));
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
};

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


export default function StoryCard({ story }) {
  if (!story) return null; 

  const defaultImage = '/img/no-image.png'; 

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800">
      <div className="relative">
        <Link to={`/truyen/${story.slug}`} className="block aspect-[3/4]"> 
          <img
            alt={story.title}
            className="w-full h-full object-cover"
            src={story.coverUrl || defaultImage}
            onError={(e) => { e.target.onerror = null; e.target.src=defaultImage }} 
            loading="lazy" 
          />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FiEye className="w-3 h-3" /> {formatCompactNumber(story.views || 0)}
          </span>
          <span className="flex items-center gap-1">
            <FiBookmark className="w-3 h-3" /> {formatCompactNumber(story.bookmarks || 0)}
          </span>
        </div>
      </div>
      {/* Nội dung card */}
      <div className="p-3">
         {/* Link tiêu đề */}
        <Link to={`/truyen/${story.slug}`}>
          <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 line-clamp-2 cursor-pointer mb-2" title={story.title}>
            {story.title}
          </h3>
        </Link>
        {/* Chương mới nhất và thời gian */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
           {story.latestChapter ? (
             <Link to={`/truyen/${story.slug}/${story.latestChapter.slug}`} className="hover:text-sky-600 dark:hover:text-sky-400 truncate" title={story.latestChapter.name}>
              {story.latestChapter.name}
            </Link>
          ) : (
            <span>Chưa có chương</span>
          )}
          <span className="flex-shrink-0 ml-2">
             {formatRelativeTime(story.latestChapter?.updatedAtISO)}
          </span>
        </div>
      </div>
    </div>
  );
}