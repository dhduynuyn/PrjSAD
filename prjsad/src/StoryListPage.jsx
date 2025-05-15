import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StoryGrid from './StoryGrid';
import Pagination from './Pagination-reuse';
import SidebarRankings from './SidebarRankings';
//import { getStoriesByCategorySlug } from '../api/storyApi'; // Backend nè Khanh - Giả sử có API function này
import { FiLoader } from 'react-icons/fi'; 

// Hàm lấy tiêu đề trang dựa trên slug
const getPageTitle = (slug) => {
    switch (slug) {
        case 'truyen-hoan-thanh': return 'Truyện Full';
        case 'truyen-moi': return 'Truyện Mới Cập Nhật';
        case 'truyen-sang-tac': return 'Truyện Sáng Tác';
        default: return 'Danh sách truyện';
    }
};

export default function StoryListPage() {
  const { categorySlug } = useParams(); // Lấy slug từ URL, ví dụ: 'truyen-hoan-thanh'
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageTitle = getPageTitle(categorySlug);

  const fetchStories = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching stories for category: ${categorySlug}, page: ${page}`);
    try {
       // --- TODO: Thay bằng API thật ---
      // const response = await getStoriesByCategorySlug(categorySlug, page);
      // Giả lập API response
      const response = await new Promise(resolve => setTimeout(() => resolve({
        data: Array.from({ length: 20 }, (_, i) => ({ // Tạo 20 truyện giả
          id: `${categorySlug}-p${page}-${i + 1}`,
          slug: `truyen-mau-${categorySlug}-${page}-${i + 1}`,
          title: `Truyện Mẫu ${categorySlug.replace(/-/g, ' ')} trang ${page} số ${i + 1}`,
          coverUrl: `https://picsum.photos/seed/${categorySlug}${page}${i}/200/260`, // Ảnh giả
          views: Math.floor(Math.random() * 5000),
          bookmarks: Math.floor(Math.random() * 100),
          latestChapter: {
            name: `Chương ${Math.floor(Math.random() * 100) + 1}`,
            slug: `chuong-${Math.floor(Math.random() * 100) + 1}`,
            updatedAtISO: new Date(Date.now() - Math.random() * 1000 * 3600 * 24).toISOString() // Thời gian ngẫu nhiên trong 24h qua
          }
        })),
        meta: { // Thông tin phân trang từ API
          currentPage: page,
          lastPage: 10, // Tổng số trang giả lập
          // totalItems: 200
        }
      }), 1000)); // Giả lập độ trễ mạng 1 giây


      setStories(response.data);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.lastPage);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setError("Không thể tải danh sách truyện. Vui lòng thử lại.");
      setStories([]); // Xóa truyện cũ nếu lỗi
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug]); // fetchStories sẽ thay đổi nếu categorySlug thay đổi

  useEffect(() => {
    // Fetch dữ liệu khi component mount hoặc khi categorySlug thay đổi, luôn về trang 1
    fetchStories(1);
     // Cuộn lên đầu trang khi đổi category
     window.scrollTo(0, 0);
  }, [fetchStories]); // Phụ thuộc vào fetchStories (đã bao gồm categorySlug)

  const handlePageChange = (page) => {
    // Fetch dữ liệu cho trang mới
    fetchStories(page);
     // Cuộn lên đầu trang khi chuyển trang
     window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
       {/* Tiêu đề trang */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">{pageTitle}</h1>
      <hr className="mb-6"/>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cột chính (danh sách truyện và phân trang) */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {isLoading && (
            <div className="flex justify-center items-center min-h-[300px]">
               <FiLoader className="animate-spin text-4xl text-sky-600" />
            </div>
          )}
          {error && (
             <div className="text-center text-red-600 bg-red-100 p-4 rounded border border-red-300">{error}</div>
          )}
          {!isLoading && !error && (
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

        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <SidebarRankings />
        </div>
      </div>
    </div>
  );
}