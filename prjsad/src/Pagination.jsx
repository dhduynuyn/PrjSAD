import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      console.log(`Changing to page ${page}`);
      window.location.href = `?page=${page}`; 
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (currentPage - halfPagesToShow < 1) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfPagesToShow > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    // Nút về trang đầu và Previous
    pageNumbers.push(
      <li key="first" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <a className="page-link" href="?page=1" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} aria-label="First">
          ««
        </a>
      </li>
    );
     pageNumbers.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <a className="page-link" href={`?page=${currentPage - 1}`} onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-label="Previous">
          «
        </a>
      </li>
    );

    // Dấu "..." ở đầu
    if (startPage > 1) {
      pageNumbers.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    // Các nút số trang
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <a className="page-link" href={`?page=${i}`} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
            {i}
          </a>
        </li>
      );
    }

     // Dấu "..." ở cuối
    if (endPage < totalPages) {
      pageNumbers.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    // Nút Next và về trang cuối
     pageNumbers.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <a className="page-link" href={`?page=${currentPage + 1}`} onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-label="Next">
          »
        </a>
      </li>
    );
     pageNumbers.push(
      <li key="last" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <a className="page-link" href={`?page=${totalPages}`} onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} aria-label="Last">
          »»
        </a>
      </li>
    );


    return pageNumbers;
  };

  const paginationStyle = `
    .pagination { display: flex; padding-left: 0; list-style: none; border-radius: .25rem; }
    .page-item { margin: 0 2px; }
    .page-item.disabled .page-link { color: #6c757d; pointer-events: none; cursor: auto; background-color: #fff; border-color: #dee2e6; }
    .page-item.active .page-link { z-index: 3; color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
    .page-link { position: relative; display: block; padding: .375rem .75rem; color: #0d6efd; text-decoration: none; background-color: #fff; border: 1px solid #dee2e6; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; }
    .page-link:hover { z-index: 2; color: #0a58ca; background-color: #e9ecef; border-color: #dee2e6; }
    .page-link:focus { z-index: 3; color: #0a58ca; background-color: #e9ecef; outline: 0; box-shadow: 0 0 0 .25rem rgba(13,110,253,.25); }
  `;

  return (
    <>
     <style>{paginationStyle}</style>
     <nav aria-label="Page navigation">
      <ul className="pagination justify-center"> {/* Thêm justify-center để căn giữa */}
         {renderPageNumbers()}
       </ul>
     </nav>
    </>

  );
}