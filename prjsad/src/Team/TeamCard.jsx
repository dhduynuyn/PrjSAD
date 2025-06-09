import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiBook } from 'react-icons/fi'; 

const formatCompactNumber = (number) => {
    if (!number && number !== 0) return 'N/A';
    if (number < 1000) return number.toString();
    const suffixes = ["", "K", "M", "B", "T"];
    const i = Math.floor(Math.log10(Math.abs(number))/3);
    const short = (number / Math.pow(1000, i)).toFixed(1);
    return short.replace(/\.0$/, '') + suffixes[i];
};


export default function TeamCard({ team }) {
  // Giả sử 'team' object có các thuộc tính:
  // id (hoặc slug), name, avatarUrl, totalViews, totalStories
  if (!team) return null;

  const defaultAvatar = '/img/no-image.png'; // Ảnh avatar mặc định cho team

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <Link to={`/nhom-dich/${team.id}`} className="block aspect-w-1 aspect-h-1"> {/* Giữ tỉ lệ ảnh vuông cho avatar */}
        <img
          alt={team.name}
          className="w-full h-full object-cover" // Ảnh avatar
          src={team.avatarUrl || defaultAvatar}
          onError={(e) => { e.target.onerror = null; e.target.src=defaultAvatar }}
          loading="lazy"
        />

      </Link>
      {/* Nội dung card */}
      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/nhom-dich/${team.id}`}>
          <h3
            className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 line-clamp-2 cursor-pointer mb-1.5"
            title={team.name}
          >
            {team.name}
          </h3>
        </Link>
        {/* Thông tin views và số truyện */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-1.5 border-t border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1" title="Tổng lượt xem">
            <FiEye className="w-3.5 h-3.5" /> {formatCompactNumber(team.totalViews || 0)}
          </span>
          <span className="flex items-center gap-1" title="Số truyện đã đăng">
            <FiBook className="w-3.5 h-3.5" /> {formatCompactNumber(team.totalStories || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}