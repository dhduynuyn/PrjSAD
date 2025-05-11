import React, { useEffect, useState } from 'react';
import StoryCard from './StoryCard';

export default function CompletedStoriesSection() {
  
  const [completedStories, setCompletedStories] = useState([]);
  const [error, setError] = useState(null);
  const viewMoreUrl = 'https://monkeyd.net.vn/truyen-hoan-thanh.html';

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchCompletedStories = async () => {
      await delay(7000);  // 3000ms = 3 giây
      try {
        const res = await fetch('http://localhost:5000/stories/status/Đã đủ bộ');
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Completed stories API response:", data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }

        const mappedStories = data.map((story) => ({
          id: story.id,
          image: story.image_data,
          title: story.title,
          chapter: story.latest_chapter,
          time: story.last_updated,
          views: story.views,
          bookmarks: story.follows,
          isFull: story.status === 'Đã đủ bộ',
          storyUrl: `/truyen/${story.id}`,
          chapterUrl: `/truyen/${story.id}/chapters/latest`,
        }));

        setCompletedStories(mappedStories);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching completed stories:', err);
        setError(err.message);
        setCompletedStories([]);
      }
    };

    fetchCompletedStories();
  }, []);

  return (
    <section className="mt-6 md:mt-8">
      <div className="flex flex-wrap gap-y-2 items-center justify-between mb-2">
        <h5 className="text-lg md:text-xl font-medium uppercase text-gray-700 tracking-wide mb-0">
          Truyện đã hoàn thành
        </h5>
        <a
          href={viewMoreUrl}
          className="px-3 py-1 text-xs md:text-sm font-medium text-sky-600 border border-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-colors duration-200"
        >
          Xem thêm
        </a>
      </div>
      <hr className="border-t border-gray-300 mb-4" />

      {error ? (
        <p className="text-red-600 text-sm mb-4">Lỗi: {error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {completedStories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      )}

      <div className="text-center mt-6 mb-4">
        <a
          href={viewMoreUrl}
          className="inline-block px-5 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors duration-200"
        >
          Xem thêm truyện hoàn thành
        </a>
      </div>
    </section>
  );
}
