import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import TeamGrid from './Team/TeamGrid';
import TeamSearchForm from './Team/TeamSearchForm';
import Pagination from './Pagination';
import { getTeamsApi } from './Team/teamApi';
import { FiLoader } from 'react-icons/fi';

export default function TeamListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async (page, currentSearchTerm) => {
    console.log("Fetching teams with params:", { search: currentSearchTerm, page });
    setIsLoading(true);
    setError(null);

    // Cập nhật URL
    const newSearchParams = new URLSearchParams();
    if (currentSearchTerm) newSearchParams.set('search', currentSearchTerm);
    if (page > 1) newSearchParams.set('page', page.toString());
    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, { replace: true });

    try {
      const response = await getTeamsApi({ search: currentSearchTerm, page });

      setTeams(response.data || []);
      setCurrentPage(response.meta?.currentPage || 1);
      setTotalPages(response.meta?.lastPage || 1);
      setTotalItems(response.meta?.totalItems || 0);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      setError("Không thể tải danh sách team. Vui lòng thử lại.");
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1');
    const searchTermFromUrl = searchParams.get('search') || '';
    if (pageFromUrl !== currentPage || searchTermFromUrl !== searchTerm || teams.length === 0) {
      fetchTeams(pageFromUrl, searchTermFromUrl);
    }
  }, [searchParams, fetchTeams]);

  const handleSearchSubmit = () => {
    const keyword = searchTerm.trim();
    if (keyword === '' && !searchParams.get('search')) return;
    fetchTeams(1, keyword);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTeams(page, searchTerm);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">
        Danh Sách Team/Tác Giả
      </h1>
      <hr className="mb-6 dark:border-gray-700"/>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 lg:w-3/4">
          <TeamSearchForm
            searchTerm={searchTerm}
            onSearchTermChange={(e) => setSearchTerm(e.target.value)}
            onSubmitSearch={handleSearchSubmit}
          />

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
              <TeamGrid teams={teams} />
              {teams.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          {/* Bên phải nếu bạn muốn thêm gì đó */}
        </div>
      </div>
    </div>
  );
}
