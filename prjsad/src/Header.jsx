"use client";
import React, { useState } from "react";
import { Link } from 'react-router-dom';

import { FiSearch, FiBell } from "react-icons/fi"; // Ví dụ dùng react-icons

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-solid border-b border-b-gray-200 h-[60px] bg-white shadow-sm"> 
      <div className="max-w-[1320px] mx-auto h-full px-4 sm:px-6 lg:px-8"> 
        <nav
          className="flex items-center justify-between h-full"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-4"> 
            <div className="flex-shrink-0"> 
              <a href="/" aria-label="Trang chủ">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b40865568aeafdd7562b3e8c22cfe92486a1cd7d?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                  alt="Company Logo"
                  className="h-8 w-auto"
                />
              </a>
            </div>

            <div className="hidden md:block"> 
              <form className="relative" role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search" className="sr-only">
                  Tìm truyện
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  id="search"
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Tìm truyện"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                 <button type="submit" className="sr-only">Search</button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                <span className="sr-only">Tìm kiếm</span>
                <FiSearch className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              aria-label="Thông báo"
            >
              <FiBell className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1.5 text-sm">
              <Link
                to="/login" 
                className="px-3 py-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register" 
                className="px-3 py-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}