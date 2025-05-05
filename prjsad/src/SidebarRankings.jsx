import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook } from 'react-icons/fi'; 
function RankingItem({ rank, item, type = 'story' }) { 
    const defaultImage = '/img/no-image.png';
    const imageSrc = type === 'story' ? (item.coverUrl || defaultImage) : (item.avatarUrl || defaultImage);
    const linkTo = type === 'story' ? `/truyen/${item.slug}` : `/nhom-dich/${item.id}`; 
    return (
         <div className="flex items-center gap-2 py-1.5 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className={`w-6 text-center font-semibold ${rank <= 3 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
                {rank}
            </div>
            <Link to={linkTo} className="flex-shrink-0">
                <img
                    src={imageSrc}
                    alt={item.name || item.title}
                    className={`h-10 w-10 object-cover ${type === 'user' ? 'rounded-full' : 'rounded-sm'}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                    loading="lazy"
                />
            </Link>
            <div className="flex-grow overflow-hidden">
                <Link to={linkTo}>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 truncate">
                        {item.name || item.title}
                    </h4>
                </Link>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                   {type === 'story' && <span>{item.latestChapter?.name || 'N/A'}</span>}
                    <span><i className="bx bx-show text-xs mr-1"></i>{formatCompactNumber(item.views || item.contributions || 0)}</span>
                </div>
            </div>
        </div>
    )
}

// Component con cho danh sách xếp hạng (ví dụ Top Ngày)
function RankingList({ title, items, type }) {
    return (
        <div>
            {items && items.length > 0 ? (
                 items.map((item, index) => (
                    <RankingItem key={item.id || item.slug} rank={index + 1} item={item} type={type} />
                ))
            ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">Chưa có dữ liệu.</p>
            )}
        </div>
    )
}

export default function SidebarRankings() {
  const [activeStoryTab, setActiveStoryTab] = useState('day'); // day, week, month, year
  const [activeUserViewTab, setActiveUserViewTab] = useState('day');
  const [activeContributionTab, setActiveContributionTab] = useState('all'); // 'all' hoặc các loại khác nếu có

  // --- TODO: Fetch data for rankings ---
  const [topStoriesDay, setTopStoriesDay] = useState([]); // Dữ liệu giả
  const [topStoriesWeek, setTopStoriesWeek] = useState([]);
  // ... tương tự cho month, year
  const [topUsersDay, setTopUsersDay] = useState([]);
   // ... tương tự cho week, month, year
   const [topContributors, setTopContributors] = useState([]);


  useEffect(() => {
    // Gọi API để lấy dữ liệu xếp hạng ở đây, ví dụ:
    // fetchTopStories('day').then(setTopStoriesDay);
    // fetchTopStories('week').then(setTopStoriesWeek);
    // ...
    // fetchTopUsers('day').then(setTopUsersDay);
    // ...
    // fetchTopContributors().then(setTopContributors);

    // Dữ liệu giả lập ví dụ:
    setTopStoriesDay([
        { id: 1, slug: 'truyen-1', title: 'CHỊ ĐÂY CÓ TIỀN, LẠI THỪA THỜI GIAN', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/05/02/1746171876-chi-day-co-tien-lai-thua-thoi-gian.jpg', latestChapter: { name: 'Chương 8' }, views: 2775 },
        { id: 2, slug: 'truyen-2', title: 'Tự Do Này Trả Lại Cho Em', coverUrl: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/05/02/1746145454-tra-em-lai-su-tu-do.jpg', latestChapter: { name: 'Chương 13' }, views: 2322 },
        // ... thêm truyện khác
    ]);
     setTopUsersDay([
         { id: 1040, name: 'Diệp Gia Gia', avatarUrl: 'https://cdn.monkeydarchive.com/images/avatar/thumbs/230/2024/08/10/1723286481-1040.jpg', views: 8286 },
         { id: 36629, name: 'Tiểu Soái thích Zhihu', avatarUrl: 'https://cdn.monkeydarchive.com/images/avatar/thumbs/230/2024/12/22/1734869674-36629.jpg', views: 4737 },
         // ... thêm user khác
     ]);
     setTopContributors([
        { id: 424, name: 'Cá Mặn Rất Mặn', avatarUrl: 'https://cdn.monkeydarchive.com/images/avatar/thumbs/230/2024/03/31/1711873411-424.jpg', contributions: 172 },
        { id: 6758, name: 'Đồng Đồng', avatarUrl: 'https://cdn.monkeydarchive.com/images/avatar/thumbs/230/2024/05/27/1716794908-6758.jpg', contributions: 161 },
        // ... thêm contributor khác
    ]);

  }, []); 

  const storyTabs = [
      { key: 'day', label: 'Ngày' },
      { key: 'week', label: 'Tuần' },
      { key: 'month', label: 'Tháng' },
      { key: 'year', label: 'Năm' },
  ];

   const userViewTabs = [
      { key: 'day', label: 'Ngày' },
      { key: 'week', label: 'Tuần' },
      { key: 'month', label: 'Tháng' },
      { key: 'year', label: 'Năm' },
  ];

  const contributionTabs = [
      { key: 'all', label: 'Cống hiến' },
  ];

  const renderStoryContent = () => {
      switch(activeStoryTab) {
          case 'day': return <RankingList title="Top Ngày" items={topStoriesDay} type="story" />;
          case 'week': return <RankingList title="Top Tuần" items={topStoriesWeek} type="story" />;
          default: return <RankingList title="Top Ngày" items={topStoriesDay} type="story" />;
      }
  }

   const renderUserViewContent = () => {
      switch(activeUserViewTab) {
          case 'day': return <RankingList title="Top Ngày" items={topUsersDay} type="user" />;
          default: return <RankingList title="Top Ngày" items={topUsersDay} type="user" />;
      }
  }

  const renderContributionContent = () => {
      switch(activeContributionTab) {
          case 'all': return <RankingList title="Cống hiến" items={topContributors} type="user" />;
          default: return <RankingList title="Cống hiến" items={topContributors} type="user" />;
      }
  }

  // Hàm tạo tab
  const renderTabs = (tabs, activeTab, setActiveTab) => (
     <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-3">
      {tabs.map(tab => (
        <li key={tab.key} className="mr-2">
          <button
            onClick={() => setActiveTab(tab.key)}
            aria-current={tab.key === activeTab ? 'page' : undefined}
            className={`inline-block p-2 rounded-t-lg focus:outline-none ${
              tab.key === activeTab
                ? 'text-sky-600 bg-gray-100 dark:bg-gray-800 dark:text-sky-500 active'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );


  return (
    <aside className="space-y-6">
      {/* Bảng Xếp Hạng Truyện */}
      <div className="bg-white p-3 rounded-lg shadow-md dark:bg-gray-800">
        <h5 className="text-center text-base font-bold text-gray-800 dark:text-gray-100 uppercase mb-3">Bảng xếp hạng</h5>
        {renderTabs(storyTabs, activeStoryTab, setActiveStoryTab)}
        <div className="tab-content">
          {renderStoryContent()}
        </div>
      </div>

       {/* Top View User */}
      <div className="bg-white p-3 rounded-lg shadow-md dark:bg-gray-800">
        <h5 className="text-center text-base font-bold text-gray-800 dark:text-gray-100 uppercase mb-3">Top View</h5>
        {renderTabs(userViewTabs, activeUserViewTab, setActiveUserViewTab)}
        <div className="tab-content">
           {renderUserViewContent()}
        </div>
      </div>

       {/* Top Contributions */}
      <div className="bg-white p-3 rounded-lg shadow-md dark:bg-gray-800">
        <h5 className="text-center text-base font-bold text-gray-800 dark:text-gray-100 uppercase mb-3">Đóng góp</h5>
         {renderTabs(contributionTabs, activeContributionTab, setActiveContributionTab)}
         <div className="tab-content">
           {renderContributionContent()}
        </div>
      </div>
    </aside>
  );
}