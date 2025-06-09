import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import StoryGrid from '../StoryGrid'; 
import Pagination from '../Pagination';
import {searchStoriesAdvancedApi, getGenresApi, getTagsApi } from './searchApi';
//import FilterSidebar from './FilterSidebar';
import { FiLoader } from 'react-icons/fi';

const sortOptions = [
  { value: 'updated_at', label: 'Mới cập nhật' }, // Thường là mặc định
  { value: 'hot', label: 'Độ hot' },
  { value: 'views', label: 'Lượt xem nhiều nhất' },
];


export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentSort = searchParams.get('sort') || 'updated_at';

  const fetchSearchResults = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);

    const apiParams = new URLSearchParams(searchParams);
    apiParams.set('page', page.toString());
    
    // Nếu không có tham số 'sort' trên URL, đặt giá trị mặc định
    if (!apiParams.has('sort')) {
      apiParams.set('sort', 'updated_at');
    }

    const paramsObject = Object.fromEntries(apiParams.entries());

    try {
      const response = await searchStoriesAdvancedApi(paramsObject);
      setStories(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
      setTotalItems(response.meta?.totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Không thể tải kết quả tìm kiếm.");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]); // Fetch lại khi query params thay đổi

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    fetchSearchResults(pageFromUrl);
    window.scrollTo(0, 0);
  }, [fetchSearchResults,]);

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    navigate(`?${newSearchParams.toString()}`, { replace: true }); 
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event) => {
    const newSortValue = event.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    
    newSearchParams.set('sort', newSortValue);
    // Khi sắp xếp lại, luôn quay về trang 1
    newSearchParams.set('page', '1');

    // Dùng navigate để cập nhật URL, việc này sẽ trigger useEffect ở trên để fetch lại data
    navigate(`/search-results?${newSearchParams.toString()}`);
  }


  const searchQueryDisplay = searchParams.get('q') || '';
  const pageTitle = searchQueryDisplay ? `Kết quả tìm kiếm cho "${searchQueryDisplay}"` : "Kết quả tìm kiếm";

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-1">
        {pageTitle}
      </h1>
      {totalItems > 0 && !isLoading && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Tìm thấy {totalItems.toLocaleString()} kết quả.</p>
      )}
      <hr className="mb-6 dark:border-gray-700"/>

      <div className="flex justify-end items-center mb-4">
        <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Sắp xếp theo:
        </label>
        <select
          id="sort-by"
          name="sort-by"
          value={currentSort}
          onChange={handleSortChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- CỘT KẾT QUẢ (Bây giờ là layout chính) --- */}
      <div className="w-full">
        {isLoading && (
          <div className="flex justify-center items-center min-h-[300px]">
             <FiLoader className="animate-spin text-4xl text-sky-600" />
          </div>
        )}
        {error && (
           <div className="text-center text-red-600 bg-red-100 p-4 rounded border border-red-300">{error}</div>
        )}
        {!isLoading && !error && stories.length === 0 && (
           <p className="text-center text-gray-500 dark:text-gray-400 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              Không tìm thấy truyện nào phù hợp với tiêu chí của bạn.
          </p>
        )}
        {!isLoading && !error && stories.length > 0 && (
          <>
            <StoryGrid stories={stories} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}