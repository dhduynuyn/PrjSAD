// src/pages/StoryDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Detail/Breadcrumbs';
import StoryInfoCard from './Detail/StoryInfoCard';
import StoryActions from './Detail/StoryActions';
import StoryDescription from './Detail/StoryDescription';
import ChapterListTab from './Detail/ChapterListTab';
import CommentTab from './Detail/CommentTab';
import RelatedStoriesSection from './Detail/RelatedStoriesSection';
//import { getStoryDetailsApi, getStoryChaptersApi, getRelatedStoriesApi, toggleFavoriteApi, toggleBookmarkApi, reportStoryApi } from '../api/storyApi'; // Giả lập các hàm API
import { FiLoader } from 'react-icons/fi';
import { useAuth } from './AuthContext'; // Lấy trạng thái đăng nhập

export default function StoryDetailPage() {
  const { storySlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Kiểm tra user đã đăng nhập chưa

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [relatedStories, setRelatedStories] = useState([]);
  const [activeTab, setActiveTab] = useState('chapters'); // 'chapters' or 'comments'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho các nút actions (cập nhật sau khi tương tác)
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching details for story: ${storySlug}`);
    try {
      // Gọi song song các API nếu có thể
      const [storyDetails, chaptersData, relatedData] = await Promise.all([
        //getStoryDetailsApi(storySlug), // API lấy chi tiết truyện
        //getStoryChaptersApi(storySlug), // API lấy danh sách chương
        //getRelatedStoriesApi(storySlug) // API lấy truyện liên quan
      ]);

      //setStory(storyDetails);
      //setChapters(chaptersData); // Giả sử API trả về mảng chapters
      //setRelatedStories(relatedData); // Giả sử API trả về mảng related stories

      // Lấy trạng thái favorite/bookmark từ API nếu user đã đăng nhập ---
      // if (isAuthenticated) {
      //    const userStatus = await getUserStoryStatusApi(storySlug);
           // setIsFavorited(userStatus.isFavorited);
           // setIsBookmarked(userStatus.isBookmarked);
      // } else {
           setIsFavorited(false); // Mặc định nếu chưa đăng nhập
           setIsBookmarked(false);
      // }


    } catch (err) {
      console.error("Failed to fetch story details:", err);
      setError("Không thể tải thông tin truyện. Vui lòng thử lại.");
      setStory(null); // Reset data nếu lỗi
      setChapters([]);
      setRelatedStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [storySlug]); // Fetch lại 

  useEffect(() => {
    fetchData();
     window.scrollTo(0, 0); // Cuộn lên đầu trang khi vào trang mới
  }, [fetchData]);

  // --- Handlers cho Actions ---
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
        alert("Vui lòng đăng nhập để yêu thích truyện!");
        navigate('/login'); // Chuyển đến trang login
        return;
    }
    // Gọi API
    try {
      // await toggleFavoriteApi(story.id); // Gửi ID truyện
      // Cập nhật state ngay lập tức để phản hồi nhanh
      setIsFavorited(!isFavorited);
       setStory(prev => ({ ...prev, favorites: isFavorited ? prev.favorites - 1 : prev.favorites + 1 }));
       console.log('Favorite toggled');
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
       // Có thể revert lại state nếu API lỗi
       // setIsFavorited(isFavorited);
    }
  };

  const handleBookmarkToggle = async () => {
     if (!isAuthenticated) {
        alert("Vui lòng đăng nhập để theo dõi truyện!");
        navigate('/login');
        return;
    }
     try {
      // await toggleBookmarkApi(story.id);
      setIsBookmarked(!isBookmarked);
      setStory(prev => ({ ...prev, followers: isBookmarked ? prev.followers - 1 : prev.followers + 1 }));
      console.log('Bookmark toggled');
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleReport = async () => {
     if (!isAuthenticated) {
        alert("Vui lòng đăng nhập để báo lỗi!");
        navigate('/login');
        return;
    }
     // Hiển thị modal/form báo lỗi ---
     const reason = prompt("Vui lòng nhập lý do báo lỗi:"); // Ví dụ đơn giản
     if (reason) {
         try {
             // await reportStoryApi(story.id, reason);
             alert("Báo lỗi đã được gửi. Cảm ơn bạn!");
             console.log(`Reported story ${story.id} for: ${reason}`);
         } catch (err) {
             console.error("Failed to report story:", err);
             alert("Gửi báo lỗi thất bại. Vui lòng thử lại.");
         }
     }
  };

  // --- Render Logic ---
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
    { name: story.title }, // Tên truyện
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Phần thông tin chính và actions */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="md:flex">
          {/* Ảnh bìa */}
          <div className="md:w-1/3 lg:w-1/4 p-4 flex-shrink-0">
            <img
              src={story.coverUrl || '/img/no-image.png'}
              className="w-full h-auto object-cover rounded aspect-[3/4]"
              alt={story.title}
              onError={(e) => { e.target.onerror = null; e.target.src='/img/no-image.png' }}
            />
          </div>
           {/* Thông tin, actions, description */}
          <div className="p-4 md:p-6 flex-grow flex flex-col">
             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{story.title}</h1>
              <dl className="grid grid-cols-12 gap-x-4 gap-y-2">

                 <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 col-span-3 sm:col-span-1">Tác giả</dt>
                 <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 col-span-9 sm:col-span-2 sm:mt-0">{story.author?.name || 'N/A'}</dd>
             </dl>
             <hr className="my-4 dark:border-gray-700"/>

            {/* Actions */}
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
            {/* Description */}
            <StoryDescription description={story.description} />
          </div>
        </div>
      </div>


      {/* Phần Tabs (Danh sách chương và Bình luận) */}
       <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 md:p-6 mb-6">
           {/* Tab Headers */}
           <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-4">
                <li className="mr-2">
                    <button
                        onClick={() => setActiveTab('chapters')}
                        aria-current={activeTab === 'chapters' ? 'page' : undefined}
                        className={`inline-flex items-center gap-2 p-3 border-b-2 rounded-t-lg focus:outline-none ${
                            activeTab === 'chapters'
                            ? 'text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500 active'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                    >
                       <i className='bx bx-list-ol'></i> 
                       Danh sách chương
                    </button>
                </li>
                <li className="mr-2">
                    <button
                        onClick={() => setActiveTab('comments')}
                        aria-current={activeTab === 'comments' ? 'page' : undefined}
                         className={`inline-flex items-center gap-2 p-3 border-b-2 rounded-t-lg focus:outline-none ${
                            activeTab === 'comments'
                            ? 'text-sky-600 border-sky-600 dark:text-sky-500 dark:border-sky-500 active'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                    >
                         <i className='bx bx-comment-detail'></i>
                         Bình luận
                    </button>
                </li>
            </ul>
           {/* Tab Content */}
            <div>
                {activeTab === 'chapters' && <ChapterListTab chapters={chapters} storySlug={storySlug} />}
                {activeTab === 'comments' && <CommentTab storyId={story?.id} />}
            </div>
       </div>


      {/* Truyện liên quan/Hot */}
      <RelatedStoriesSection title="Truyện Hot Tháng Này" stories={relatedStories} />

    </div>
  );
}
