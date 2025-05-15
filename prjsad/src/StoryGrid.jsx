import React from 'react';
import StoryCard from './StoryCard-reuse';

export default function StoryGrid({ stories }) {
  if (!stories || stories.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">Không tìm thấy truyện nào.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {stories.map((story) => (
        <StoryCard key={story.id || story.slug} story={story} /> // Sử dụng key duy nhất
      ))}
    </div>
  );
}