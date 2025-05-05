import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoryCard from './StoryCard';
import Pagination from './Pagination';

export default function UpdatedStoriesSection() {
  const [searchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`http://localhost:5000/stories/paginated?page=${currentPage}`);
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Updated stories API response:", data);

        if (!data || !Array.isArray(data.stories)) {
          throw new Error('Invalid data format from API');
        }

        const mappedStories = data.stories.map(story => ({
          id: story.id,
          image: story.image_data,
          title: story.title,
          chapter: story.latest_chapter,
          time: story.last_updated,
          views: story.views,
          bookmarks: story.follows,
          isFull: story.status === 'Đã đủ bộ',
          storyUrl: `/stories/${story.id}`,
          chapterUrl: `/stories/${story.id}/chapters/latest`,
        }));

        setStories(mappedStories);
        setTotalPages(data.total_pages || 1);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching updated stories:", err);
        setError(err.message);
        setStories([]);
      }
    };

    fetchStories();
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-4">
        <h2 className="text-lg font-semibold tracking-wide leading-tight uppercase text-gray-800 mb-0">
          Truyện mới cập nhật
        </h2>
        <hr className="mt-2 mb-4 border-t border-gray-300" />

        {error ? (
          <p className="text-red-600 text-sm mb-4"></p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {stories.map(story => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </div>
  );
}
