import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; 

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

     if (currentPage <= halfPagesToShow) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfPagesToShow >= totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }


    // Nút trang đầu và ...
    if (startPage > 1) {
      pageNumbers.push(
        <li key="first">
          <button
            onClick={() => handlePageClick(1)}
            className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pageNumbers.push(<li key="start-ellipsis" className="px-3 py-1 mx-1">...</li>);
      }
    }

    // Các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => handlePageClick(i)}
            className={`px-3 py-1 mx-1 rounded border ${
              i === currentPage
                ? 'bg-sky-600 text-white border-sky-600 cursor-default'
                : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
            disabled={i === currentPage}
          >
            {i}
          </button>
        </li>
      );
    }

     // Nút trang cuối và ...
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<li key="end-ellipsis" className="px-3 py-1 mx-1">...</li>);
      }
      pageNumbers.push(
        <li key="last">
          <button
            onClick={() => handlePageClick(totalPages)}
            className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </li>
      );
    }


    return pageNumbers;
  };

  return (
    <nav aria-label="Pagination" className="mt-6 flex justify-center">
      <ul className="inline-flex items-center -space-x-px text-sm">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <FiChevronLeft className="w-4 h-4" />
          </button>
        </li>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
             <span className="sr-only">Next</span>
             <FiChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}