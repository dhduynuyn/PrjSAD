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

export default function StoryInfoCard({ story }) {
  if (!story) return null;
  const defaultImage = '/img/no-image.png';

  const renderMetaData = (label, value, link = null) => {
    if (!value) return null;
    return (
      <>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-3 sm:col-span-1">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 col-span-9 sm:col-span-2 sm:mt-0">
          {link ? <Link to={link} className="text-sky-600 hover:underline dark:text-sky-400">{value}</Link> : value}
        </dd>
      </>
    );
  };

  const renderGenres = (genres) => {
    if (!genres || genres.length === 0) return null;
    return (
       <>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-3 sm:col-span-1">Thể loại</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 col-span-9 sm:col-span-2 sm:mt-0 flex flex-wrap gap-1">
          {genres.map(genre => (
            <Link
              key={genre.slug}
              to={`/the-loai/${genre.slug}`} 
              className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {genre.name}
            </Link>
          ))}
        </dd>
      </>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Ảnh bìa */}
        <div className="md:w-1/3 lg:w-1/4 p-4 flex-shrink-0">
          <img
            src={story.coverUrl || defaultImage}
            className="w-full h-auto object-cover rounded aspect-[3/4]"
            alt={story.title}
            onError={(e) => { e.target.onerror = null; e.target.src=defaultImage }}
          />
        </div>

        <div className="p-4 md:p-6 flex-grow">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{story.title}</h2>
          <dl className="grid grid-cols-12 gap-x-4 gap-y-2">
            {renderMetaData("Cập nhật", formatRelativeTime(story.updatedAtISO))}
            {/* {renderMetaData("Loại", story.type || "Truyện Chữ")} */}
            {renderMetaData("Tác giả", story.author?.name)} {/* Giả sử author là object */}
            {renderGenres(story.genres)} {/* Giả sử genres là mảng object */}
             {story.translatorTeam && renderMetaData("Team", story.translatorTeam.name, `/nhom-dich/${story.translatorTeam.id}`)}
            {renderMetaData("Lượt xem", story.views?.toLocaleString() || 0)}
            {renderMetaData("Yêu thích", story.favorites?.toLocaleString() || 0)}
            {renderMetaData("Theo dõi", story.followers?.toLocaleString() || 0)}
            {renderMetaData("Trạng thái", story.status || 'Đang cập nhật')}
          </dl>
          <hr className="my-4 dark:border-gray-700"/>
        </div>
      </div>
    </div>
  );
}