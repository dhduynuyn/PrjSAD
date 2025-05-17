import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function TeamSearchForm({ searchTerm, onSearchTermChange, onSubmitSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSearch();  
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6"> 
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
          name="teamSearch" // Đặt tên cho input (tùy chọn)
          value={searchTerm}
          onChange={onSearchTermChange} // Gọi hàm từ props khi input thay đổi
          placeholder="Tìm dịch giả/tác giả theo tên..."
        />
        {/* Icon tìm kiếm bên trong input */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch className="w-5 h-5" />
        </span>
        {/* Nút submit có thể ẩn hoặc là một button rõ ràng bên cạnh */}
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-4 text-sky-600 dark:text-sky-400 hover:text-sky-700 rounded-r-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Tìm kiếm"
        >
          <FiSearch className="w-5 h-5 sm:hidden" /> {/* Icon cho mobile */}
          <span className="hidden sm:inline">Tìm</span> {/* Chữ cho desktop */}
        </button>
      </div>
    </form>
  );
}