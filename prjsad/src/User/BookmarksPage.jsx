import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Pagination from '../Pagination-reuse'; 
import StoryCard from '../StoryCard';     
import { FiLoader } from 'react-icons/fi';
import { useAuth } from '../AuthContext';    
import { getBookmarksApi, deleteBookmarkApi } from '../userApi'; // API chuyên cho truyện đã lưu

export default function BookmarksPage() {
  // Lấy thông tin xác thực từ Context
  const { isAuthenticated, token, isLoadingAuth } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  
  const [bookmarkedStories, setBookmarkedStories] = useState([]); // State để lưu danh sách truyện
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm gọi API để lấy danh sách truyện đã lưu
  const fetchBookmarks = useCallback(async (pageToFetch) => {
    // Chỉ thực hiện khi người dùng đã được xác thực
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getBookmarksApi({ token, page: pageToFetch });
      setBookmarkedStories(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setError("Không thể tải danh sách truyện đã lưu. Vui lòng thử lại.");
      setBookmarkedStories([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]); // Phụ thuộc vào token và trạng thái đăng nhập

  // useEffect để gọi API khi trang thay đổi hoặc khi xác thực xong
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      const pageFromUrl = parseInt(searchParams.get('page') || '1');
      fetchBookmarks(pageFromUrl);
      window.scrollTo(0, 0);
    }
  }, [searchParams, fetchBookmarks, isLoadingAuth, isAuthenticated]);

  // Hàm xử lý việc xóa một truyện khỏi danh sách
  const handleDeleteBookmark = async (itemIdToDelete, storyTitle) => {
    if (window.confirm(`Bạn có chắc muốn xóa truyện "${storyTitle}" khỏi danh sách đã lưu không?`)) {
      try {
        await deleteBookmarkApi({ token, itemId: itemIdToDelete });
        // Cập nhật UI ngay lập tức bằng cách lọc item đã xóa ra khỏi state
        setBookmarkedStories(currentStories => 
          currentStories.filter(item => item.id !== itemIdToDelete)
        );
      } catch (err) {
        console.error("Failed to delete bookmark:", err);
        alert("Xóa thất bại, vui lòng thử lại sau.");
      }
    }
  };

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };
  
  // ----- Xử lý trạng thái và điều hướng -----

  // Nếu AuthContext đang kiểm tra, hiển thị loading
  if (isLoadingAuth) {
    return <div className="flex justify-center items-center min-h-[50vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
  }

  // Nếu không đăng nhập, điều hướng về trang login
  if (!isAuthenticated) {
    // Lưu lại trang hiện tại để sau khi login có thể quay lại
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // ----- Render Giao diện -----

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">TRUYỆN ĐÃ LƯU</h1>
      <hr className="mb-6 dark:border-gray-700"/>

      <main className="w-full">
        {isLoading && (
          <div className="flex justify-center items-center min-h-[300px]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>
        )}
        {error && (
           <div className="text-center text-red-600 bg-red-100 p-4 rounded">{error}</div>
        )}
        {!isLoading && !error && bookmarkedStories.length === 0 && (
           <p className="text-center text-gray-500 dark:text-gray-400 py-10">Bạn chưa lưu truyện nào.</p>
        )}
        {!isLoading && !error && bookmarkedStories.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bookmarkedStories.map((item) => (
                <StoryCard
                  key={item.id}
                  // Truyền dữ liệu vào StoryCard
                  image={item.story.coverImage}
                  title={item.story.title}
                  storyUrl={`/truyen/${item.story.slug}`}
                  chapter={item.story.latestChapter || 'N/A'}
                  views={item.story.views || 0}
                  bookmarks={item.story.bookmarks || 0}
                  isFull={item.story.status === 'COMPLETED'}

                  // Truyền trực tiếp hàm xóa vào prop onDelete
                  onDelete={() => handleDeleteBookmark(item.id, item.story.title)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}