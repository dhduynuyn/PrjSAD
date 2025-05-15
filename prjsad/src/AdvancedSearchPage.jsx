import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchForm from './Search/SearchForm';
import SearchResults from './Search/SearchResults';
//import { searchStoriesAdvancedApi, getGenresApi, getTagsApi } from '../api/searchApi';

const initialFilters = {
    keyword: '',
    status: [],
    officialType: [],
    genderTarget: [],
    age: [],
    ending: [],
    genres: [],
    tags: [],
    excludedTags: [],
    totalChapters: '',
};

export default function AdvancedSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Đọc filter từ URL hoặc dùng giá trị mặc định
  const [filters, setFilters] = useState(() => {
    const newFilters = { ...initialFilters };
    for (const key in newFilters) {
        if (Array.isArray(newFilters[key])) {
            newFilters[key] = searchParams.getAll(key) || [];
        } else {
            newFilters[key] = searchParams.get(key) || '';
        }
    }
    return newFilters;
  });


  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Để biết người dùng đã nhấn nút tìm kiếm hay chưa

  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [genresData, tagsData] = await Promise.all([
            getGenresApi(),
            getTagsApi()
        ]);
        setAvailableGenres(genresData || []);
        setAvailableTags(tagsData || []);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchFilterData();
  }, []);


  const performSearch = useCallback(async (pageToFetch = 1, currentFilters) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    const paramsToSubmit = { ...currentFilters, page: pageToFetch };

    // Cập nhật URL query params
    const newSearchParams = new URLSearchParams();
    for (const key in currentFilters) {
        if (Array.isArray(currentFilters[key])) {
            currentFilters[key].forEach(val => newSearchParams.append(key, val));
        } else if (currentFilters[key]) {
            newSearchParams.set(key, currentFilters[key]);
        }
    }
    if (pageToFetch > 1) newSearchParams.set('page', pageToFetch.toString());
    navigate(`?${newSearchParams.toString()}`, { replace: true });


    console.log("Searching with params:", paramsToSubmit);
    try {
      const response = await searchStoriesAdvancedApi(paramsToSubmit); // Gọi API thật
      setSearchResults(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Tìm kiếm thất bại. Vui lòng thử lại.");
      setSearchResults([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Tự động tìm kiếm nếu có query params trên URL khi tải trang lần đầu
  useEffect(() => {
      const hasInitialFilters = Object.values(filters).some(value =>
          Array.isArray(value) ? value.length > 0 : !!value
      );
      if (hasInitialFilters) {
          performSearch(currentPage, filters);
      }
  }, []); // Chỉ chạy một lần khi mount để xử lý initial search


  const handleSubmitSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
    performSearch(1, filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    setSearchResults([]);
    setTotalPages(1);
    setHasSearched(false);
    navigate('/tim-kiem-nang-cao', { replace: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    performSearch(page, filters);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Tìm Kiếm Nâng Cao
      </h1>
      <hr className="mb-6 dark:border-gray-700"/>

      <SearchForm
        filters={filters}
        setFilters={setFilters} // Truyền hàm setFilters để SearchForm có thể cập nhật
        onSubmit={handleSubmitSearch}
        onReset={handleResetFilters}
        isLoading={isLoading}
        availableGenres={availableGenres}
        availableTags={availableTags}
      />

      <SearchResults
        results={searchResults}
        isLoading={isLoading && hasSearched} // Chỉ hiển thị loading của results nếu đã thực hiện tìm kiếm
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasSearched={hasSearched}
      />
    </div>
  );
}