"use client";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import { FiSearch, FiLoader, FiBell, FiMoon, FiSun, FiUser, FiSettings, FiLogOut, FiChevronDown, FiChevronsUp, FiBookmark, FiEye, FiBell as FiBellOutline } from "react-icons/fi"; // Thêm icons cần thiết
import { useAuth } from './AuthContext';
import { searchStoriesAdvancedApi } from './Search/searchApi';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchContainerRef = useRef(null); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

    useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    setIsResultsVisible(true);
    setIsSearching(true);

    const debounceTimer = setTimeout(() => {
      searchStoriesAdvancedApi({ q: searchQuery, limit: 5 }) // Giới hạn 5 kết quả cho dropdown
        .then(response => {
          setSearchResults(response.data || []);
        })
        .catch(error => {
          console.error("Lỗi khi tìm kiếm:", error);
          setSearchResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300); // Đợi 300ms sau khi người dùng ngừng gõ

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Xử lý sự kiện nhấn Enter trên ô tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsResultsVisible(false); 
      navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-[1320px] mx-auto h-[60px] px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-full"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Trang chủ">
                <img
                   src="https://cdn.builder.io/api/v1/image/assets/TEMP/b40865568aeafdd7562b3e8c22cfe92486a1cd7d?apiKey=741f47dd65dd4c5584bc71eba79f2904"
                  alt="Company Logo"
                  className="h-8 w-auto" 
                />
              </Link>
            </div>
            <div className="hidden md:block relative" ref={searchContainerRef}>
             <form className="relative" role="search" onSubmit={handleSearchSubmit}>
                 <label htmlFor="search-header" className="sr-only">Tìm truyện</label>
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                   <FiSearch className="h-5 w-5" />
                 </div>
                 <input
                   type="search"
                   id="search-header"
                   className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                   placeholder="Tìm truyện"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => searchQuery.trim() && setIsResultsVisible(true)} // Hiển thị lại kết quả khi focus
                   autoComplete="off" 
                 />
                  <button type="submit" className="sr-only">Search</button>
               </form>

               {/* --- Dropdown kết quả tìm kiếm --- */}
               {isResultsVisible && (
                 <div className="absolute mt-2 w-full md:w-[450px] origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                   <div className="py-1">
                     {isSearching && (
                       <div className="flex items-center justify-center p-4">
                         <FiLoader className="animate-spin h-5 w-5 text-gray-500" />
                         <span className="ml-2 text-gray-600 dark:text-gray-300">Đang tìm kiếm...</span>
                       </div>
                     )}

                     {!isSearching && searchResults.length === 0 && searchQuery && (
                       <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                         Không tìm thấy kết quả cho "{searchQuery}"
                       </div>
                     )}

                     {!isSearching && searchResults.length > 0 && (
                       <>
                         <ul className="divide-y divide-gray-100 dark:divide-gray-600">
                           {searchResults.map((story) => (
                             <li key={story.id}>
                               <Link
                                 to={`/truyen/${story.slug}`} // Chỉnh lại đường dẫn tới trang truyện của bạn
                                 className="flex items-center gap-3 p-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                 onClick={() => setIsResultsVisible(false)} // Ẩn dropdown khi click vào 1 item
                               >
                                 <img src={story.coverImage || 'https://monkeyd.net.vn/img/avata.png'} alt={story.title} className="h-14 w-10 object-cover rounded-sm flex-shrink-0" />
                                 <div className="flex-grow overflow-hidden">
                                   <p className="font-semibold truncate">{story.title}</p>
                                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{story.authorName || 'Chưa rõ'}</p>
                                 </div>
                               </Link>
                             </li>
                           ))}
                         </ul>
                         <div className="border-t border-gray-200 dark:border-gray-600">
                           <Link
                             to={`/search-results?q=${encodeURIComponent(searchQuery.trim())}`}
                             className="block w-full text-center px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                             onClick={() => setIsResultsVisible(false)}
                           >
                             Xem tất cả kết quả
                           </Link>
                         </div>
                       </>
                     )}
                   </div>
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
             <button className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <span className="sr-only">Tìm kiếm</span>
                <FiSearch className="h-6 w-6" />
            </button>
            <button
              className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Thông báo"
            >
              <FiBellOutline className="h-6 w-6" />
              {isAuthenticated && (
                 <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
             )}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={user.avatar || "https://monkeyd.net.vn/img/avata.png"}
                    alt={user.name || "User Avatar"}
                    className="h-8 w-8 rounded-full object-cover" 
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user.name || 'User'}</span>
                  <FiChevronDown className="hidden md:block h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10" // Thêm z-index
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name || 'User Name'}</p>
                      </div>

                       {/* Menu Items */}
                      <Link to="/user/tro-thanh-tac-gia" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiChevronsUp /><span>Đăng truyện</span>
                      </Link>
                      <Link to="/user/dich-gia-dang-theo-doi" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiBell /><span>Đang theo dõi</span>
                      </Link>
                       <Link to="/user/lich-su-doc-truyen" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiEye /><span>Truyện đã đọc</span>
                      </Link>
                      <Link to="/user/truyen-da-luu" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiBookmark /><span>Truyện đã lưu</span>
                      </Link>
                      <Link to="/user/thong-tin-ca-nhan" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiUser /><span>Thông tin</span>
                      </Link>
                       <Link to="/user/doi-mat-khau" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2" role="menuitem" tabIndex="-1">
                        <FiSettings /><span>Đổi mật khẩu</span>
                      </Link>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center px-4 py-2 text-sm gap-2"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        <FiLogOut /><span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ---- CHƯA ĐĂNG NHẬP ----
              <div className="flex items-center gap-1.5 text-sm">
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}