import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Detail/Breadcrumbs';
import StoryActions from '../Detail/StoryActions';
import StoryDescription from '../Detail/StoryDescription';
import ChapterListTab from '../Detail/ChapterListTab';
import CommentTab from '../Detail/CommentTab';
import RelatedStoriesSection from '../Detail/RelatedStoriesSection';
import { FiLoader } from 'react-icons/fi';
import { useAuth } from '../AuthContext';

const DEMO_STORY_SLUG = "cha-my-nhan-cua-ta-hac-hoa-roi";

const mockStoryDetailData = {
  id: 13853,
  title: "Cha mỹ nhân của ta hắc hoá rồi",
  slug: DEMO_STORY_SLUG,
  coverUrl: "https://cdn.monkeydarchive.com/images/story/2025/04/22/1745292879-cha-my-nhan-cua-ta-hac-hoa-roi.jpg",
  author: { name: "Tiểu Tân Trà" },
  genres: ["Trọng Sinh", "Cổ Đại", "Trả Thù", "Gia Đình", "Cung Đấu", "Xuyên Không", "Ngọt"],
  views: 29085,
  favorites: 9,
  followers: 17,
  status: "Đã đủ bộ",
  description: `
    <p>Xuyên không đến thời cổ đại, Khương Dao nhận được một thân thế đầy buff: một người cha mỹ mạo như bình hoa, cùng với người mẹ quyền cao chức trọng.</p>
    <p>Mẹ cô sau khi sinh cô xong liền vứt cô cho người cha ở nông thôn chăm sóc, còn mình quay lại hoàng thành tranh quyền đoạt vị. Mãi đến khi người cha cực khổ nuôi nấng cô trưởng thành, mẹ cô mới nhớ ra rằng mình còn có một đứa con gái và một người chồng.</p>
    <p>Năm đó, cô tám tuổi.</p>
    <p>Giữa việc tiếp tục cùng cha làm ruộng hay theo mẹ về kinh thành, cô dứt khoát chọn cái sau.</p>
    <p>Dù sao nhà mẹ cô thật sự có ngai vàng cần kế thừa, dù sao cô cũng được nuông chiều từ nhỏ, cuộc sống điền viên quả thật không hợp với cô.</p>
    <p>Rồi cô phát hiện mình đã đánh giá thấp sự hiểm ác của quyền mưu thời cổ đại, là một kẻ yếu đuối, cô bị hành hạ tàn nhẫn và cuối cùng chết rất thảm.</p>
    <p>Khi biết tin cô đã chết, mẹ cô chỉ bình thản bồi dưỡng các hoàng tử khác, cuối cùng vẫn là cha cô thay cô thu dọn thi thể và mang cô về nhà.</p>
    <p>Trọng sinh trở lại năm tám tuổi, Khương Dao thấu hiểu sâu sắc: đã yếu thì đừng có chơi nữa.</p>
    <p>Khi mẹ cô lại đến đón cô, cô lập tức ôm chặt chân cha và khóc lớn: "Con không muốn rời xa cha đâu!"</p>
    <p>Cha cô lại vuốt đầu cô, mỉm cười dịu dàng: "Được thôi, vậy chúng ta cùng đi."</p>
    <p>Khương Dao: …Khoan đã! Trước đây không phải cha nói vậy mà!?</p>
    <p>…</p>
    <p>Ban đầu cô tưởng kiếp này khởi đầu bất lợi, không chỉ phải tìm cách bảo toàn mạng sống mà còn phải bảo vệ người cha mỹ nhân yếu đuối không thể tự lo liệu mà cứ thích chen chân vào mọi chuyện.</p>
    <p>Cho đến khi cô phát hiện, cha cô vừa dỗ cô ngủ xong thì quay đầu lại bắt đầu đại sát tứ phương.</p>
    <p>…Sự việc phát triển sao lại không giống những gì cô nghĩ?</p>
    <p>…</p>
    <p>Cha: Ở kiếp trước, nhìn cô chết yểu, cha đau lòng đến tan nát gan ruột, hối hận khôn nguôi.</p>
    <p>Ở kiếp này: …Ừm, hôm nay lại là một ngày cha từ con hiếu rồi.</p>
  `,
  translatorTeam: { name: "Thế Giới Tiểu Thuyết", url: "https://monkeydtruyen.com/nhom-dich/44605" },
  updatedAtText: "3 tuần trước",
  storyType: "Truyện Chữ",
};

const mockChaptersListData = [
  { id: 1, name: "Chương 1", slug: "chuong-1", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() }, // "name" và "updatedAtISO"
  { id: 2, name: "Chương 2", slug: "chuong-2", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 3, name: "Chương 3", slug: "chuong-3", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
  // ...
  { id: 264, name: "Chương 264", slug: "chuong-264", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 265, name: "Chương 265", slug: "chuong-265", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 266, name: "Chương 266", slug: "chuong-266", updatedAtISO: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
].sort((a,b) => a.id - b.id); // Đảm bảo chương được sắp xếp


const mockRelatedStoriesListData = [
  {
    id: 1001,
    title: "NHỮNG BỨC THƯ TÌNH",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/05/06/1746470843-nhung-buc-thu-tinh.jpg",
    storyUrl: "/story/nhung-buc-thu-tinh", 
    slug: "nhung-buc-thu-tinh",
  },
  {
    id: 1002,
    title: "SAN PHẲNG NÚI NON",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/05/05/1746403816-san-phang-nui-linh-nam.jpg",
    storyUrl: "/story/san-phang-nui-non",
    slug: "san-phang-nui-non",
  },
];

const mockUserStatusData = {
  isFavorited: false,
  isBookmarked: false,
};


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

    // LOGIC MOCK DATA ----
    if (storySlug === DEMO_STORY_SLUG) {
      console.log("⚠️ Using MOCK DATA for slug:", storySlug);
      // Giả lập độ trễ của API
      await new Promise(resolve => setTimeout(resolve, 500)); 

      setStory({
        id: mockStoryDetailData.id,
        title: mockStoryDetailData.title,
        coverUrl: mockStoryDetailData.coverUrl,
        author: mockStoryDetailData.author,
        genres: mockStoryDetailData.genres,
        views: mockStoryDetailData.views,
        favorites: mockStoryDetailData.favorites,
        followers: mockStoryDetailData.followers,
        status: mockStoryDetailData.status,
        description: mockStoryDetailData.description,
        translatorTeam: mockStoryDetailData.translatorTeam,
        updatedAtText: mockStoryDetailData.updatedAtText,
        storyType: mockStoryDetailData.storyType,
      });
      setChapters(mockChaptersListData);
      setRelatedStories(mockRelatedStoriesListData);
      
      // Giả lập trạng thái yêu thích/theo dõi
      if (isAuthenticated) { // Chỉ giả lập nếu đã đăng nhập
        setIsFavorited(mockUserStatusData.isFavorited);
        setIsBookmarked(mockUserStatusData.isBookmarked);
      } else {
        setIsFavorited(false);
        setIsBookmarked(false);
      }

      setIsLoading(false);
      return; // Quan trọng: Dừng ở đây, không gọi API thật
    }
    // ---- END: LOGIC MOCK DATA ----

    // Phần code fetch API thật giữ nguyên
    try {
      const storyRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}`);
      const chaptersRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}/chapters`);
      const relatedRes = await fetch(`http://localhost:5000/stories/slug/${storySlug}/related`);

      if (!storyRes.ok || !chaptersRes.ok || !relatedRes.ok) {
        // Xử lý lỗi chi tiết hơn
        if (!storyRes.ok) console.error("Story API error:", storyRes.status, await storyRes.text());
        if (!chaptersRes.ok) console.error("Chapters API error:", chaptersRes.status, await chaptersRes.text());
        if (!relatedRes.ok) console.error("Related API error:", relatedRes.status, await relatedRes.text());
        throw new Error("Một trong các API trả về lỗi.");
      }

      const storyData = await storyRes.json();
      const chaptersData = await chaptersRes.json();
      const relatedData = await relatedRes.json();

      console.log("✅ Story details:", storyData);
      console.log("✅ Chapters:", chaptersData);
      console.log("✅ Related stories:", relatedData);
      console.log("?????????????????");

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
        translatorTeam: storyData.translatorTeam || null,
        // Thêm các trường khác nếu API của  trả về mà cần dùng
        // updatedAtText: storyData.updatedAtText, // Ví dụ
        // storyType: storyData.storyType,       // Ví dụ
      });

      setChapters(chaptersData || []);
      setRelatedStories(relatedData || []);
      
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (token) {
          const userStatusRes = await fetch(`http://localhost:5000/user/story-status/${storySlug}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (userStatusRes.ok) {
            const userStatus = await userStatusRes.json();
            if (userStatus && userStatus.hasOwnProperty('isFavorited') && userStatus.hasOwnProperty('isBookmarked')) {
              setIsFavorited(userStatus.isFavorited);
              setIsBookmarked(userStatus.isBookmarked);
            } else {
              console.error("Dữ liệu trạng thái người dùng không hợp lệ:", userStatus);
              setIsFavorited(false); setIsBookmarked(false);
            }
          } else {
            console.error(`Lỗi API trạng thái người dùng: ${userStatusRes.status}`);
            setIsFavorited(false); setIsBookmarked(false);
          }
        } else {
          console.warn("Token không tồn tại, không thể lấy trạng thái người dùng.");
          setIsFavorited(false); setIsBookmarked(false);
        }
      } else {
        setIsFavorited(false); setIsBookmarked(false);
      }

    } catch (err) {
      console.error("❌ Error fetching story details (API):", err);
      setError("Không thể tải thông tin truyện. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [storySlug, isAuthenticated]); 
  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]); // fetchData đã bao gồm storySlug và isAuthenticated

  // ... (các hàm handleFavoriteToggle, handleBookmarkToggle, handleReport giữ nguyên)
  // Ví dụ, trong handleFavoriteToggle:
  // if (storySlug === DEMO_STORY_SLUG) {
  //   setIsFavorited(!isFavorited);
  //   setStory(prev => ({ ...prev, favorites: prev.favorites + (!isFavorited ? 1 : -1) }));
  //   alert("Đã " + (!isFavorited ? "thêm vào" : "bỏ khỏi") + " yêu thích (DEMO)");
  //   return;
  // }


  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để yêu thích truyện!");
      navigate('/login');
      return;
    }

    // ---- START: LOGIC MOCK FAVORITE ----
    if (storySlug === DEMO_STORY_SLUG) {
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);
        setStory(prev => ({ 
            ...prev, 
            favorites: newFavoritedState ? prev.favorites + 1 : Math.max(0, prev.favorites - 1)
        }));
        alert(newFavoritedState ? "Đã thêm truyện vào danh sách yêu thích! (DEMO)" : "Đã bỏ truyện khỏi danh sách yêu thích! (DEMO)");
        return;
    }
    // ---- END: LOGIC MOCK FAVORITE ----

    // Code API thật
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/stories/${storySlug}/favorite`, {
        method: 'POST', // Hoặc PUT/DELETE tùy theo API của bạn
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ storyId: story.id }) // Gửi ID truyện nếu cần
      });
      if (response.ok) {
        const result = await response.json();
        setIsFavorited(result.isFavoritedNow); // API nên trả về trạng thái mới
        setStory(prev => ({
          ...prev,
          favorites: result.updatedFavoritesCount, // API nên trả về số lượng mới
        }));
        alert(result.message || (result.isFavoritedNow ? "Đã thêm vào yêu thích!" : "Đã bỏ yêu thích!"));
      } else {
        const error = await response.json();
        alert(error.message || "Lỗi khi yêu thích.");
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
    // ---- START: LOGIC MOCK BOOKMARK ----
    if (storySlug === DEMO_STORY_SLUG) {
        const newBookmarkedState = !isBookmarked;
        setIsBookmarked(newBookmarkedState);
        setStory(prev => ({ 
            ...prev, 
            followers: newBookmarkedState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
        }));
        alert(newBookmarkedState ? "Đã thêm truyện vào danh sách theo dõi! (DEMO)" : "Đã bỏ truyện khỏi danh sách theo dõi! (DEMO)");
        return;
    }
    // ---- END: LOGIC MOCK BOOKMARK ----

    // Code API thật
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/stories/${storySlug}/toggle-bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        setIsBookmarked(result.isBookmarkedNow);
        setStory(prev => ({
          ...prev,
          followers: result.updatedFollowers,
        }));
        alert(result.message || (result.isBookmarkedNow ? "Đã theo dõi truyện!" : "Đã bỏ theo dõi truyện!"));
      } else {
        const error = await response.json();
        alert(error.message || "Lỗi khi theo dõi.");
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
        // ---- START: LOGIC MOCK REPORT ----
        if (storySlug === DEMO_STORY_SLUG) {
            console.log("DEMO: Reported story", storySlug, "Reason:", reason);
            alert("Báo lỗi đã được gửi (DEMO). Cảm ơn bạn!");
            return;
        }
        // ---- END: LOGIC MOCK REPORT ----
      try {
        // Code API thật
        await fetch(`http://localhost:5000/stories/${storySlug}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', /* Thêm Authorization nếu cần */ },
          body: JSON.stringify({ reason, storyId: story?.id }), // Gửi storyId nếu backend cần
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
              {/* Thêm các trường mới từ mock data nếu cần */}
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
                {story.genres.map((g, i) => (
                  <span key={i} className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-200 px-2 py-1 mr-2 mb-2 rounded text-xs">
                    {g}
                  </span>
                ))}
              </dd>
              
              {/* Hiển thị thông tin team dịch nếu có */}
              {story.translatorTeam && story.translatorTeam.name && (
                <>
                  <dt className="col-span-3 sm:col-span-2 font-medium">Team</dt>
                  <dd className="col-span-9 sm:col-span-10">
                    {story.translatorTeam.url ? (
                       <a href={story.translatorTeam.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 bg-sky-100 dark:bg-sky-900 px-2 py-1 rounded text-xs">
                         {story.translatorTeam.name}
                       </a>
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
              storySlug={storySlug} // Vẫn dùng storySlug từ URL
              firstChapterSlug={chapters[0]?.slug}
              latestChapterSlug={chapters[chapters.length - 1]?.slug}
              isFavorited={isFavorited}
              isBookmarked={isBookmarked}
              onFavoriteToggle={handleFavoriteToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onReport={handleReport}
            />
            {/* Sử dụng dangerouslySetInnerHTML cho description vì nó chứa HTML */}
            <StoryDescription descriptionHTML={story.description} />
          </div>
        </div>
      </div>

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
              <i className="bx bx-comment-detail"></i> Bình luận {/* Thêm số lượng bình luận nếu có */}
            </button>
          </li>
        </ul>
        <div>
          {/* Truyền uploadedDateText cho ChapterListTab nếu component đó cần */}
          {activeTab === 'chapters' && <ChapterListTab chapters={chapters} storySlug={storySlug} />}
          {activeTab === 'comments' && <CommentTab storyId={story?.id} storySlugForDemo={storySlug === DEMO_STORY_SLUG ? DEMO_STORY_SLUG : undefined} />}
        </div>
      </div>
      {/* Truyền slug cho RelatedStoriesSection để nó có thể tạo Link đúng */}
      <RelatedStoriesSection title="Truyện liên quan" stories={relatedStories} />
    </div>
  );
}