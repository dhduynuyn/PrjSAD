import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { FiLoader, FiUsers, FiEye, FiBookmark, FiDollarSign } from 'react-icons/fi';
import Breadcrumbs from './Detail/Breadcrumbs'; 
import StoryGrid from './StoryGrid'; 
import Pagination from './Pagination-reuse'; 
import { useAuth } from './AuthContext';

// --- API GIẢ LẬP ---
// Bạn cần thay thế bằng các lệnh fetch API thật
const fetchTeamDataApi = async (teamSlug) => {
  console.log(`API: Fetching team data for ${teamSlug}`);
  // API thật: return fetch(`http://localhost:5000/teams/slug/${teamSlug}`).then(res => res.json());
  return Promise.resolve({
    id: 44605,
    name: 'Thế Giới Tiểu Thuyết',
    slug: teamSlug,
    avatarUrl: 'https://cdn.monkeydarchive.com/images/avatar/thumbs/230/2025/03/25/1742877068-44605.jpg',
    description: 'Chúc cả nhà một ngày tốt lành ❤️ Tui là Thế Giới Tiểu Thuyết trên MonkeyD ❤️\nMong cả nhà có trải nghiệm vui vẻ trên kênh của tui. Cả nhà fơ lâu tui để đọc truyện mới nha.',
    followerCount: 35,
    totalViews: 592179,
    storyCount: 7,
  });
};

const fetchStoriesByTeamApi = async (teamSlug, page) => {
  console.log(`API: Fetching stories for ${teamSlug}, page ${page}`);
  // API thật: return fetch(`http://localhost:5000/teams/slug/${teamSlug}/stories?page=${page}`).then(res => res.json());
  // Dữ liệu giả lập
  const allStories = [
      { id: 14305, title: 'Hệ liệt Lục Linh Châu - Linh Dị - Hiện Đại - Hài', slug: 'he-liet-luc-linh-chau', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/05/03/1746241335-he-liet-luc-linh-chau-linh-di-hien-dai-hai.jpg', views: 77544, bookmarks: 88, status: 'FULL', latestChapter: { name: 'Chương 395', updatedAtText: '5 ngày trước' }},
      { id: 13853, title: 'Cha mỹ nhân của ta hắc hoá rồi', slug: 'cha-my-nhan-cua-ta-hac-hoa-roi', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/22/1745292879-cha-my-nhan-cua-ta-hac-hoa-roi.jpg', views: 31336, bookmarks: 19, status: 'FULL', latestChapter: { name: 'Chương 266', updatedAtText: '1 tháng trước' }},
      { id: 13058, title: 'ĐĂNG HOA TIẾU - Nữ Tử Cô Độc Vào Kinh Trả Thù Cho Cả Gia Đình', slug: 'dang-hoa-tieu', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/05/1743823077-dang-hoa-tieu-nu-tu-co-doc-vao-kinh-tra-thu-cho-ca-gia-dinh.jpg', views: 111178, bookmarks: 30, status: 'FULL', latestChapter: { name: 'Chương 257', updatedAtText: '2 tháng trước' }},
      { id: 12577, title: 'Thần Y Tiểu Nông Dân - Xuyên Không - Làm Ruộng - Cung Đấu', slug: 'than-y-tieu-nong-dan', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/27/1743060770-than-y-tieu-nong-dan-xuyen-khong-lam-ruong-cung-dau.jpg', views: 24162, bookmarks: 15, status: 'FULL', latestChapter: { name: 'Chương 634', updatedAtText: '2 tháng trước' }},
      { id: 12531, title: 'Hệ Liệt Địa Sư Thiếu Nữ Full 23 Truyện - Linh Dị', slug: 'he-liet-dia-su-thieu-nu', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/26/1742982746-he-liet-dia-su-thieu-nu-full-23-truyen-linh-di.jpg', views: 61652, bookmarks: 78, status: 'FULL', latestChapter: { name: 'Chương 147', updatedAtText: '2 tháng trước' }},
      { id: 12467, title: 'Full 18 Truyện Hệ Liệt Tân Di Livestream Đoán Mệnh', slug: 'he-liet-tan-di', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/25/1742902310-he-liet-tan-di-livestream-doan-menh.jpg', views: 9007, bookmarks: 29, status: 'FULL', latestChapter: { name: 'Chương 73', updatedAtText: '2 tháng trước' }},
      { id: 12458, title: 'Quân Hôn - Thủ trưởng, vợ anh dắt con đến tìm rồi!!!', slug: 'quan-hon', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/25/1742877639-quan-hon-thu-truong-vo-anh-dat-con-den-tim-roi.jpg', views: 211283, bookmarks: 49, status: 'FULL', latestChapter: { name: 'Chương 270', updatedAtText: '2 tháng trước' }},
  ];
  return Promise.resolve({
    data: allStories, // Phân trang sẽ cần logic phức tạp hơn
    meta: { currentPage: page, lastPage: 1, totalItems: allStories.length }
  });
}
// --- KẾT THÚC API GIẢ LẬP ---

export default function TranslatorTeamPage() {
  const { teamSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, token } = useAuth(); // Để xử lý nút theo dõi

  const [team, setTeam] = useState(null);
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); 

  const fetchData = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi song song API lấy thông tin team và danh sách truyện
      const [teamData, storiesData] = await Promise.all([
        fetchTeamDataApi(teamSlug),
        fetchStoriesByTeamApi(teamSlug, page),
      ]);
      
      setTeam(teamData);
      setStories(storiesData.data);
      setPagination({
        currentPage: storiesData.meta.currentPage,
        totalPages: storiesData.meta.lastPage
      });

      // API kiểm tra trạng thái theo dõi (nếu user đã đăng nhập)
      if (isAuthenticated && teamData.id) {
          // const followStatusRes = await fetch(`http://localhost:5000/user/team-follow-status/${teamData.id}`, { headers: { 'Authorization': `Bearer ${token}` }});
          // const statusData = await followStatusRes.json();
          // setIsFollowing(statusData.isFollowing);
          // Dữ liệu giả
          setIsFollowing(false);
      }

    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin nhóm dịch. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [teamSlug, isAuthenticated, token]);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1');
    fetchData(currentPage);
    window.scrollTo(0, 0);
  }, [fetchData, searchParams]);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };
  
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
        alert("Vui lòng đăng nhập để theo dõi nhóm dịch!");
        return;
    }
    // Logic gọi API để theo dõi/bỏ theo dõi
    // const res = await fetch(`http://localhost:5000/teams/${team.id}/toggle-follow`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
    // if (res.ok) {
        setIsFollowing(prev => !prev);
        setTeam(prev => ({
            ...prev,
            followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
        }));
    // } else {
    //     alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    // }
  }


  if (isLoading) {
    return <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-screen"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
  }
  if (error) {
    return <div className="container mx-auto px-4 py-6 text-center text-red-600">{error}</div>;
  }
  if (!team) {
    return <div className="container mx-auto px-4 py-6 text-center text-gray-500">Không tìm thấy nhóm dịch.</div>;
  }

  const breadcrumbItems = [
    { name: 'Trang chủ', link: '/' },
    { name: 'Nhóm dịch', link: '/nhom-dich' }, // Có thể tạo trang list tất cả các nhóm
    { name: team.name },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Team Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={team.avatarUrl || '/img/no-image.png'}
              alt={team.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              onError={(e) => { e.target.onerror = null; e.target.src='/img/no-image.png' }}
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
            {team.description && (
                <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{team.description}</p>
            )}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <FiUsers /> <b>{team.followerCount.toLocaleString()}</b> người theo dõi
              </span>
              <span className="flex items-center gap-2">
                <FiEye /> <b>{team.totalViews.toLocaleString()}</b> lượt xem
              </span>
              <span className="flex items-center gap-2">
                <FiBookmark /> <b>{team.storyCount}</b> truyện
              </span>
            </div>
            <div className="mt-4 flex justify-center md:justify-start">
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                <FiBookmark />
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stories List Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white uppercase mb-4">Danh sách truyện</h2>
        <hr className="mb-6 dark:border-gray-700"/>
        {stories.length > 0 ? (
          <>
            <StoryGrid stories={stories} />
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-10">Nhóm này chưa đăng truyện nào.</p>
        )}
      </div>
    </div>
  );
}