import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
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
      console.log("✅ storyData.comments:", storyData.comments);

      setStory({
        id: storyData.id,
        title: storyData.title,
        coverUrl: storyData.coverUrl || (storyData.image_data ? `data:image/jpeg;base64,${storyData.image_data}` : ''),
        updatedAtText: storyData.last_updated || "",
        author: storyData.author || { name: 'N/A' },
        genres: storyData.genres || [],
        views: storyData.views || 0,
        favorites: storyData.favorites || 0,
        followers: storyData.followers || 0,
        status: storyData.status || '',
        chapter: storyData.chapters || [],
        description: storyData.description || '',
        translatorTeam: storyData.translatorTeam
          ? {
              name: storyData.translatorTeam.name || 'N/A',
              slug: storyData.translatorTeam.slug || '', 
              id: storyData.translatorTeam.id || '',
            }
          : null,
        comments: storyData.comments || [],
      });

      setChapters(chaptersData || []);
      setRelatedStories(relatedData || []);

      console.log("CHECK: ", isAuthenticated);

      // Nếu cần lấy trạng thái yêu thích/theo dõi thì gọi thêm fetch nữa.
      if (isAuthenticated) {
        const token = localStorage.getItem('token'); // 🔥 Lấy token ra
      
        if (token) {  // Kiểm tra xem token có tồn tại không
          const userStatusRes = await fetch(`http://localhost:5000/user/story-status/${storySlug}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
      
          // Kiểm tra mã trạng thái HTTP
          if (userStatusRes.ok) {
            const userStatus = await userStatusRes.json();
      
            // Kiểm tra dữ liệu trả về có hợp lệ không (ví dụ: check các thuộc tính cần thiết)
            if (userStatus && userStatus.hasOwnProperty('isFavorited') && userStatus.hasOwnProperty('isBookmarked')) {
              setIsFavorited(userStatus.isFavorited);
              setIsBookmarked(userStatus.isBookmarked);
              console.log("DEBUG: ", userStatus.isFavorited, userStatus.isBookmarked);  // Ghi log khi dữ liệu hợp lệ
            } else {
              console.error("Dữ liệu trả về không hợp lệ:", userStatus);
              setIsFavorited(false);
              setIsBookmarked(false);
            }
          } else {
            // Nếu response không thành công (status code khác 2xx)
            console.error(`Lỗi API: ${userStatusRes.status} - ${userStatusRes.statusText}`);
            alert(`Không thể lấy trạng thái người dùng. Mã lỗi: ${userStatusRes.status}`);
            setIsFavorited(false);
            setIsBookmarked(false);
          }
        } else {
          // Token không tồn tại trong localStorage
          console.error("Token không tồn tại");
          alert("Bạn cần đăng nhập để thực hiện hành động này.");
          setIsFavorited(false);
          setIsBookmarked(false);
        }
      } else {
        // Nếu người dùng chưa đăng nhập
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
  
    // Kiểm tra trạng thái isFavorited ngay lập tức
    if (isFavorited) {
      alert("Truyện này đã được thêm vào danh sách yêu thích.");
      return;  // Nếu đã yêu thích thì không cần thực hiện hành động gì thêm
    }
  
    try {
      // Gửi yêu cầu tới backend để toggle favorite
      const token = localStorage.getItem('token'); // 🔥 Lấy token ra
      const response = await fetch(`http://localhost:5000/stories/${storySlug}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra phản hồi từ backend
      if (response.ok) {
        const result = await response.json();
  
        // Cập nhật trạng thái `isFavorited` và số lượng yêu thích
        setIsFavorited(true);
        setStory(prev => ({
          ...prev,
          favorites: result.updatedFavorites,  // Cập nhật số lượng yêu thích từ phản hồi backend
        }));
  
        alert("Đã thêm truyện vào danh sách yêu thích!");
      } else {
        // Nếu có lỗi, hiển thị thông báo
        const error = await response.json();
        alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
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
  
    // Kiểm tra trạng thái bookmark ngay lập tức
    if (isBookmarked) {
      alert("Truyện này đã được thêm vào danh sách theo dõi.");
      return;  // Nếu đã bookmark thì không cần thực hiện hành động gì thêm
    }
  
    try {
      // Gửi yêu cầu tới backend để toggle bookmark
      const token = localStorage.getItem('token'); // 🔥 Lấy token ra
      const response = await fetch(`http://localhost:5000/stories/${storySlug}/toggle-bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra phản hồi từ backend
      if (response.ok) {
        const result = await response.json();
  
        // Cập nhật trạng thái `isBookmarked` và số lượng theo dõi
        setIsBookmarked(true);
        setStory(prev => ({
          ...prev,
          followers: result.updatedFollowers,  // Cập nhật số lượng followers từ phản hồi backend
        }));
  
        alert("Đã thêm truyện vào danh sách theo dõi!");
      } else {
        // Nếu có lỗi, hiển thị thông báo
        const error = await response.json();
        alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
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
              {story.updatedAtText && (
                <>
                  <dt className="col-span-3 sm:col-span-2 font-medium">Cập nhật</dt>
                  <dd className="col-span-9 sm:col-span-10">{story.updatedAtText}</dd>
                </>
              )}
              {story.storyType && (
                <>
                  <dt className="col-span-3 sm:col-span-2 font-medium">Loại</dt>
                  <dd className="col-span-9 sm:col-span-10">
                     <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 mr-2 mb-2 rounded text-xs">
                        {story.storyType}
                     </span>
                  </dd>
                </>
              )}


              <dt className="col-span-3 sm:col-span-2 font-medium">Tác giả</dt>
              <dd className="col-span-9 sm:col-span-10">{story.author?.name}</dd>

              <dt className="col-span-3 sm:col-span-2 font-medium">Thể loại</dt>
              <dd className="col-span-9 sm:col-span-10">
                {story.genres.map((genre, i) => (
                  <Link
                    key={i}
                    to={`/the-loai/${genre.slug}`} 
                    className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200 px-2 py-1 mr-2 mb-2 rounded text-xs hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </dd>

              {story.translatorTeam && story.translatorTeam.name && (
                <>
                  <dt className="col-span-3 sm:col-span-2 font-medium">Team</dt>
                  <dd className="col-span-9 sm:col-span-10">
                    {story.translatorTeam && story.translatorTeam.slug ? (
                      <Link 
                        to={`/nhom-dich/${story.translatorTeam.slug}`} 
                        className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 bg-sky-100 dark:bg-sky-900 px-2 py-1 rounded text-xs transition-colors"
                      >
                        {story.translatorTeam.name}
                      </Link>
                    ) : (
                       <span className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200 px-2 py-1 mr-2 mb-2 rounded text-xs">
                        {story.translatorTeam.name}
                       </span>
                    )}
                  </dd>
                </>
              )}

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
          {activeTab === 'comments' && <CommentTab storyId={story?.id} initialComments={story?.comments || []}/>}
        </div>
      </div>

      {/* <RelatedStoriesSection title="Truyện liên quan" stories={relatedStories} /> */}
    </div>
  );
}
