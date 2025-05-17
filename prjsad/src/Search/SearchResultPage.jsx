import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import StoryGrid from '../StoryGrid'; 
import Pagination from '../Pagination';
import SidebarRankings from '../SidebarRankings'; 
import {getGenresApi, getTagsApi } from './searchApi';
import { FiLoader } from 'react-icons/fi';

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQueryDisplay, setSearchQueryDisplay] = useState('');

  const fetchSearchResults = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);

    const params = {};
    for (const [key, value] of searchParams.entries()) {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value; 
      }
    }

    const apiParams = {};
    const arrayKeys = ['status', 'officialType', 'genderTarget', 'age', 'ending', 'genres', 'tags', 'excludedTags'];
    for (const key of searchParams.keys()) {
        if (arrayKeys.includes(key)) {
            apiParams[key] = searchParams.getAll(key);
        } else {
            apiParams[key] = searchParams.get(key);
        }
    }
    apiParams.page = pageToFetch; 
    setSearchQueryDisplay(apiParams.q || '');

     console.log(`Fetching search results with params:`, apiParams);
    try {
      const response = await searchStoriesAdvancedApi(apiParams); // Truyền apiParams
      setStories(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
      setTotalItems(response.meta?.totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Không thể tải kết quả tìm kiếm. Vui lòng thử lại.");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]); // Fetch lại khi query params thay đổi

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    fetchSearchResults(pageFromUrl);
    window.scrollTo(0, 0);
  }, [fetchSearchResults, searchParams]);

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    navigate(`?${newSearchParams.toString()}`, { replace: true }); // { replace: true } để không tạo entry mới trong history
    window.scrollTo(0, 0);
  };

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
          {!isLoading && !error && stories.length === 0 && searchQueryDisplay && (
             <p className="text-center text-gray-500 dark:text-gray-400">Không tìm thấy truyện nào.</p>
          )}
           {!isLoading && !error && stories.length === 0 && !searchQueryDisplay && (
             <p className="text-center text-gray-500 dark:text-gray-400">Vui lòng nhập từ khóa hoặc chọn bộ lọc để tìm kiếm.</p>
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
        <div className="w-full md:w-1/3 lg:w-1/4">
          <SidebarRankings />
        </div>
      </div>
    </div>
  );
}