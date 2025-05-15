import React from 'react';
import StoryGrid from '../StoryGrid';
import Pagination from '../Pagination';
import { FiLoader } from 'react-icons/fi';

export default function SearchResults({
  results,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  hasSearched // Biến boolean để biết người dùng đã thực hiện tìm kiếm hay chưa
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FiLoader className="animate-spin text-4xl text-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-100 p-4 rounded border border-red-300 mb-6">{error}</div>
    );
  }

  if (hasSearched && results.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Không tìm thấy truyện nào khớp với tiêu chí của bạn.</p>;
  }
  if (!hasSearched && results.length === 0) {
      return null; // Không hiển thị gì nếu chưa tìm kiếm và không có kết quả ban đầu
  }


  return (
    <>
      <StoryGrid stories={results} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}