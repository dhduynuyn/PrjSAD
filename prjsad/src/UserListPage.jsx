import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Pagination from './Pagination-reuse';
import StoryCard from './StoryCard'; // Sử dụng StoryCard bạn đã cung cấp
import { FiLoader } from 'react-icons/fi';
import { useAuth } from './AuthContext'; // Cần để xác thực

// Props mà component này sẽ nhận từ Router:
// - pageTitle: Tiêu đề của trang (e.g., "TRUYỆN ĐÃ LƯU")
// - fetchDataApi: Hàm API để lấy danh sách (e.g., getBookmarksApi)
// - deleteDataApi: Hàm API để xóa một mục (e.g., deleteBookmarkApi)
// - cardType: Một chuỗi để nhận dạng loại trang (e.g., 'bookmark', 'history')

export default function UserListPage({ pageTitle, fetchDataApi, deleteDataApi, cardType }) {
  // Lấy thông tin xác thực từ Context
  const { isAuthenticated, token, isLoadingAuth } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  
  const [items, setItems] = useState([]); // Dữ liệu từ API (lịch sử, truyện lưu, ...)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm gọi API lấy dữ liệu
  const fetchData = useCallback(async (pageToFetch) => {
    if (!isAuthenticated) return; // Dừng lại nếu chưa đăng nhập

    setIsLoading(true);
    setError(null);
    try {
      // Gọi API được truyền vào qua props, kèm theo token và page
      const response = await fetchDataApi({ token, page: pageToFetch });
      setItems(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
    } catch (err) {
      console.error("Failed to fetch user list:", err);
      setError("Không thể tải danh sách của bạn. Vui lòng thử lại.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDataApi, token, isAuthenticated]);

  // useEffect để gọi API khi trang thay đổi hoặc khi user đăng nhập
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      const pageFromUrl = parseInt(searchParams.get('page') || '1');
      fetchData(pageFromUrl);
      window.scrollTo(0, 0);
    }
  }, [searchParams, fetchData, isLoadingAuth, isAuthenticated]);

  // Hàm xử lý việc xóa một item
  const handleDeleteItem = async (itemIdToDelete, storyTitle) => {
    if (window.confirm(`Bạn có chắc muốn xóa truyện "${storyTitle}" khỏi danh sách này không?`)) {
      try {
        await deleteDataApi({ token, itemId: itemIdToDelete });
        // Cập nhật UI ngay lập tức bằng cách lọc item đã xóa ra khỏi state
        setItems(currentItems => currentItems.filter(item => item.id !== itemIdToDelete));
      } catch (err) {
        console.error("Failed to delete item:", err);
        alert("Xóa thất bại, vui lòng thử lại sau.");
      }
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };
  
  // ----- Xử lý trạng thái và điều hướng -----

  // Nếu AuthContext đang kiểm tra đăng nhập, hiển thị loading
  if (isLoadingAuth) {
    return <div className="flex justify-center items-center min-h-[50vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
  }

  // Nếu kiểm tra xong và không đăng nhập, điều hướng về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // ----- Render Giao diện -----

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">{pageTitle}</h1>
      <hr className="mb-6 dark:border-gray-700"/>

      <div className="flex flex-col md:flex-row gap-8">
        <main className="w-full">
          {isLoading && (
            <div className="flex justify-center items-center min-h-[300px]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>
          )}
          {error && (
             <div className="text-center text-red-600 bg-red-100 p-4 rounded">{error}</div>
          )}
          {!isLoading && !error && items.length === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 py-10">Danh sách của bạn đang trống.</p>
          )}
          {!isLoading && !error && items.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item) => (
                  <StoryCard
                    key={item.id}
                    // Dữ liệu cho StoryCard
                    image={item.story.coverImage}
                    title={item.story.title}
                    storyUrl={`/truyen/${item.story.slug}`}
                    chapter={item.lastReadChapter?.name || item.story.latestChapter || 'N/A'}
                    views={item.story.views || 0}
                    bookmarks={item.story.bookmarks || 0}
                    isFull={item.story.status === 'COMPLETED'}
                    onDelete={
                      cardType === 'bookmark'
                        ? () => handleDeleteItem(item.id, item.story.title)
                        : undefined // Không truyền gì cho các loại trang khác
                    }
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}