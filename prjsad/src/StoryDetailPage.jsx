import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Detail/Breadcrumbs';
import StoryActions from './Detail/StoryActions';
import StoryDescription from './Detail/StoryDescription';
import ChapterListTab from './Detail/ChapterListTab';
import CommentTab from './Detail/CommentTab';
import RelatedStoriesSection from './Detail/RelatedStoriesSection';
import { FiLoader } from 'react-icons/fi';
import { useAuth } from './AuthContext';

export default function StoryDetailPage() {
  const { storySlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [relatedStories, setRelatedStories] = useState([]);
  const [activeTab, setActiveTab] = useState('chapters');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storyRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}`);
      const chaptersRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}/chapters`);
      const relatedRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}/related`);

      if (!storyRes.ok || !chaptersRes.ok || !relatedRes.ok) {
        throw new Error("Một trong các API trả về lỗi.");
      }

      const storyData = await storyRes.json();
      const chaptersData = await chaptersRes.json();
      const relatedData = await relatedRes.json();

      console.log("✅ Story details:", storyData);
      console.log("✅ Chapters:", chaptersData);
      console.log("✅ Related stories:", relatedData);

      setStory({
        id: storyData.id,
        title: storyData.title,
        coverUrl: storyData.coverUrl || (storyData.image_data ? `data:image/jpeg;base64,${storyData.image_data}` : ''),
        author: storyData.author || { name: 'N/A' },
        genres: storyData.genres || [],
        views: storyData.views || 0,
        favorites: storyData.favorites || 0,
        followers: storyData.followers || 0,
        status: storyData.status || '',
        description: storyData.description || '',
      });

      setChapters(chaptersData || []);
      setRelatedStories(relatedData || []);

      // Nếu cần lấy trạng thái yêu thích/theo dõi thì gọi thêm fetch nữa.
      if (isAuthenticated) {
        const userStatusRes = await fetch(`http://localhost:5000/user/story-status/${storySlug}`);
        if (userStatusRes.ok) {
          const userStatus = await userStatusRes.json();
          setIsFavorited(userStatus.isFavorited);
          setIsBookmarked(userStatus.isBookmarked);
        }
      } else {
        setIsFavorited(false);
        setIsBookmarked(false);
      }

    } catch (err) {
      // console.error("❌ Error fetching story details:", err);
      // setError("Không thể tải thông tin truyện. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [storySlug, isAuthenticated]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để yêu thích truyện!");
      navigate('/login');
      return;
    }
    try {
      await fetch(`http://localhost:5000/stories/${storySlug}/toggle-favorite`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsFavorited(prev => !prev);
      setStory(prev => ({
        ...prev,
        favorites: isFavorited ? prev.favorites - 1 : prev.favorites + 1,
      }));
    } catch (err) {
      console.error("❌ Failed to toggle favorite:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để theo dõi truyện!");
      navigate('/login');
      return;
    }
    try {
      await fetch(`http://localhost:5000/stories/${storySlug}/toggle-bookmark`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsBookmarked(prev => !prev);
      setStory(prev => ({
        ...prev,
        followers: isBookmarked ? prev.followers - 1 : prev.followers + 1,
      }));
    } catch (err) {
      console.error("❌ Failed to toggle bookmark:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để báo lỗi!");
      navigate('/login');
      return;
    }
    const reason = prompt("Vui lòng nhập lý do báo lỗi:");
    if (reason) {
      try {
        await fetch(`http://localhost:5000/stories/${storySlug}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reason }),
        });
        alert("Báo lỗi đã được gửi. Cảm ơn bạn!");
      } catch (err) {
        console.error("❌ Failed to report story:", err);
        alert("Gửi báo lỗi thất bại. Vui lòng thử lại.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-red-600 bg-red-100 p-6 rounded border border-red-300">
        {error}
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        Không tìm thấy thông tin truyện.
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Trang chủ', link: '/' },
    { name: story.title },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Info section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 p-4 flex-shrink-0">
            <img
              src={story.coverUrl || '/img/no-image.png'}
              alt={story.title}
              className="w-full h-auto object-cover rounded aspect-[3/4]"
              onError={(e) => { e.target.onerror = null; e.target.src='/img/no-image.png' }}
            />
          </div>
          <div className="p-4 md:p-6 flex-grow flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{story.title}</h1>
            <dl className="grid grid-cols-12 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-200">
              <dt className="col-span-3 sm:col-span-2 font-medium">Tác giả</dt>
              <dd className="col-span-9 sm:col-span-10">{story.author?.name}</dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Thể loại</dt>
              <dd className="col-span-9 sm:col-span-10">
                {story.genres.map((g, i) => (
                  <span key={i} className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200 px-2 py-1 mr-2 mb-2 rounded text-xs">
                    {g}
                  </span>
                ))}
              </dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Lượt xem</dt>
              <dd className="col-span-9 sm:col-span-10">{story.views.toLocaleString()}</dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Yêu thích</dt>
              <dd className="col-span-9 sm:col-span-10">{story.favorites.toLocaleString()}</dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Theo dõi</dt>
              <dd className="col-span-9 sm:col-span-10">{story.followers.toLocaleString()}</dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Trạng thái</dt>
              <dd className="col-span-9 sm:col-span-10">{story.status}</dd>
            </dl>

            <hr className="my-4 dark:border-gray-700" />

            <StoryActions
              storySlug={storySlug}
              firstChapterSlug={chapters[0]?.slug}
              latestChapterSlug={chapters[chapters.length - 1]?.slug}
              isFavorited={isFavorited}
              isBookmarked={isBookmarked}
              onFavoriteToggle={handleFavoriteToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onReport={handleReport}
            />
            <StoryDescription description={story.description} />
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 md:p-6 mb-6">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-4">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`inline-flex items-center gap-2 p-3 border-b-2 rounded-t-lg focus:outline-none ${
                activeTab === 'chapters'
                  ? 'text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500 active'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <i className="bx bx-list-ol"></i> Danh sách chương
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('comments')}
              className={`inline-flex items-center gap-2 p-3 border-b-2 rounded-t-lg focus:outline-none ${
                activeTab === 'comments'
                  ? 'text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500 active'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <i className="bx bx-comment-detail"></i> Bình luận
            </button>
          </li>
        </ul>
        <div>
          {activeTab === 'chapters' && <ChapterListTab chapters={chapters} storySlug={storySlug} />}
          {activeTab === 'comments' && <CommentTab storyId={story?.id} />}
        </div>
      </div>

      <RelatedStoriesSection title="Truyện liên quan" stories={relatedStories} />
    </div>
  );
}
