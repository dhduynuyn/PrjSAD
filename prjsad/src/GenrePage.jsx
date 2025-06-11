// src/components/GenrePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import StoryGrid from './StoryGrid';
import Pagination from './Pagination-reuse';
import { getStoriesApi } from './storyApi'; // Giả sử bạn có hàm này
import { FiLoader } from 'react-icons/fi';

// Hàm này nên được đặt trong file api của bạn, ví dụ: genreApi.js
// Giả lập API lấy thông tin thể loại bằng slug
async function getGenreDetailsBySlug(slug) {
  // Trong thực tế, bạn sẽ gọi: const res = await fetch(`http://localhost:5000/genres/slug/${slug}`);
  // Đây là dữ liệu giả lập
  console.log(`Fetching genre details for slug: ${slug}`);
  // API của bạn nên trả về một object có tên thể loại, ví dụ: { name: "Hành Động" }
  // Để đơn giản, chúng ta sẽ chuyển slug thành Title Case
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return Promise.resolve({ name });
}


export default function GenrePage() {
  const { genreSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [stories, setStories] = useState([]);
  const [genreName, setGenreName] = useState(''); // State để lưu tên thể loại
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (pageToFetch) => {
    setIsLoading(true);
    setError(null);
    setGenreName(''); // Reset tên thể loại khi fetch lại

    try {
      // Gọi đồng thời API lấy thông tin thể loại và danh sách truyện
      const [genreDetails, storiesResponse] = await Promise.all([
        getGenreDetailsBySlug(genreSlug),
        getStoriesApi({ genre: genreSlug, page: pageToFetch }) // Sử dụng filter 'genre'
      ]);

      // Xử lý kết quả
      setGenreName(genreDetails.name || 'Không xác định');
      
      setStories(storiesResponse.data || []);
      setCurrentPage(storiesResponse.meta?.currentPage || 1);
      setTotalPages(storiesResponse.meta?.lastPage || 1);
      setTotalItems(storiesResponse.meta?.totalItems || 0);

    } catch (err) {
      console.error(`Failed to fetch data for genre ${genreSlug}:`, err);
      setError("Không thể tải dữ liệu cho thể loại này. Vui lòng thử lại.");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [genreSlug]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    fetchData(pageFromUrl);
    window.scrollTo(0, 0);
  }, [searchParams, fetchData]);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };
  
  // Breadcrumbs cho trang thể loại
  const breadcrumbItems = [
    { name: 'Trang chủ', link: '/' },
    { name: 'Thể loại', link: '/the-loai' }, // Có thể tạo một trang liệt kê tất cả thể loại
    { name: genreName || 'Đang tải...' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
       {/* Breadcrumbs có thể thêm ở đây nếu muốn */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">
        Thể loại: {isLoading ? 'Đang tải...' : genreName}
      </h1>
      {totalItems > 0 && !isLoading && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Tìm thấy {totalItems.toLocaleString()} truyện.
          </p>
      )}
      <hr className="mb-6 dark:border-gray-700"/>

      <div className="flex flex-col md:flex-row gap-6">
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
             <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                Không tìm thấy truyện nào thuộc thể loại "{genreName}".
             </p>
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
      </div>
    </div>
  );
}