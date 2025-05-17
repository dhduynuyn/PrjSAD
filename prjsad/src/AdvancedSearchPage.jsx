import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchForm from './Search/SearchForm';
import {getGenresApi, getTagsApi } from './Search/searchApi';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Đọc filter từ URL hoặc dùng giá trị mặc định
  const [filters, setFilters] = useState(() => {
    const newFilters = { ...initialFilters };
    for (const key in newFilters) {
       const paramKey = key === 'keyword' ? 'q' : (key === 'totalChapters' ? 'tc' : key); // Key cho URL
        if (Array.isArray(newFilters[key])) {
            newFilters[key] = searchParams.getAll(key) || [];
        } else {
            newFilters[key] = searchParams.get(key) || '';
        }
    }
    return newFilters;
  });


  //const [searchResults, setSearchResults] = useState([]);
  //const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  //const [totalPages, setTotalPages] = useState(1);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  //const [error, setError] = useState(null);
  //const [hasSearched, setHasSearched] = useState(false); // Để biết người dùng đã nhấn nút tìm kiếm hay chưa

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
      } finally {
        setIsLoadingForm(false);
      }
    };
    fetchFilterData();
  }, []);

  const handleSubmitSearch = () => {
    const newSearchParams = new URLSearchParams();
    for (const key in filters) {
        const value = filters[key];
        const paramKey = key === 'keyword' ? 'q' : (key === 'totalChapters' ? 'tc' : key);

        if (Array.isArray(value) && value.length > 0) {
            value.forEach(val => newSearchParams.append(paramKey, val));
        } else if (!Array.isArray(value) && value) {
            newSearchParams.set(paramKey, value);
        }
    }
    // Khi tìm kiếm mới từ form, luôn bắt đầu từ trang 1
    newSearchParams.set('page', '1');
    navigate(`/search-results?${newSearchParams.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    navigate('/tim-kiem-nang-cao', { replace: true }); // Xóa query params khỏi URL
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
        isLoading={isLoadingForm}
        availableGenres={availableGenres}
        availableTags={availableTags}
      />
    </div>
  );
}