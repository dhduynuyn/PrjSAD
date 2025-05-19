import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import StoryGrid from './StoryGrid';
import Pagination from './Pagination-reuse';
//import SidebarRankings from './SidebarRankings';
import { getStoriesApi  } from './storyApi'; 
import { FiLoader } from 'react-icons/fi'; 

// Hàm lấy tiêu đề trang dựa trên slug
const PAGE_CONFIGS = {
  'truyen-hoan-thanh': {
    title: 'Truyện Full',
    apiFilter: { status: 28 },
  },
  'truyen-moi': {
    title: 'Truyện Mới Cập Nhật',
    apiFilter: { orderBy: 'updatedAt', orderDirection: 'desc' },
  },};

export default function StoryListPage() {
  const { listTypeSlug } = useParams();   
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentConfig = PAGE_CONFIGS[listTypeSlug] || { title: 'Danh sách truyện', apiFilter: {} };
  const pageTitle = currentConfig.title;

  const fetchStories = useCallback(async (pageToFetch) => {
    setIsLoading(true);
    setError(null);

    const filters = {
      ...currentConfig.apiFilter,
      page: pageToFetch,
    };

    console.log(`Fetching stories with filters:`, filters);
    try {
       //Thay bằng API thật ---
      // const response = await getStoriesByCategorySlug(categorySlug, page);
      // Giả lập API response
      const response = await getStoriesApi(filters);

      setStories(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
      setTotalItems(response.meta?.totalItems || 0);

    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setError("Không thể tải danh sách truyện. Vui lòng thử lại.");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [listTypeSlug, currentConfig.apiFilter]); // fetchStories phụ thuộc vào loại danh sách và filter của nó

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    // setCurrentPage(pageFromUrl); // fetchStories sẽ cập nhật state này sau khi API trả về
    fetchStories(pageFromUrl);
    window.scrollTo(0, 0);
  }, [searchParams, fetchStories]);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    // fetchStories sẽ được gọi lại bởi useEffect do searchParams thay đổi
    window.scrollTo(0, 0);
  };

  console.log('listTypeSlug:', listTypeSlug);


  // Nếu listTypeSlug không hợp lệ (không có trong PAGE_CONFIGS)
  if (!PAGE_CONFIGS[listTypeSlug]) {
    return (
        <div className="container mx-auto px-4 py-10 text-center">
            <h1 className="text-2xl font-bold text-red-600">Loại danh sách không hợp lệ.</h1>
            <p className="mt-4"><Link to="/" className="text-sky-600 hover:underline">Quay về trang chủ</Link></p>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">{pageTitle}</h1>
      {totalItems > 0 && !isLoading && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Có {totalItems.toLocaleString()} truyện.</p>
      )}
      <hr className="mb-6 dark:border-gray-700"/>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 lg:w-3/4">
          {isLoading && (
            <div className="flex justify-center items-center min-h-[300px]">
               <FiLoader className="animate-spin text-4xl text-sky-600" />
            </div>
          )}
          {error && (
             <div className="text-center text-red-600 bg-red-100 p-4 rounded border border-red-300">{error}</div>
          )}
          {!isLoading && !error && stories.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 py-10">Không tìm thấy truyện nào.</p>
          )}
          {!isLoading && !error && stories.length > 0 && (
            <>
              <StoryGrid stories={stories} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4">
        </div>
      </div>
    </div>
  );
}