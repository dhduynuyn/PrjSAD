"use client";
import React, { useState } from "react";
import { FiSearch, FiBell } from "react-icons/fi"; // Ví dụ dùng react-icons

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  // Thường không cần div bao ngoài cùng này trừ khi có lý do cụ thể khác
  // <div className="flex flex-col justify-center py-px">

  // Header: Chịu trách nhiệm border dưới và chiều cao tổng thể
  // Bỏ padding ngang lớn (px-[300px]), việc căn giữa sẽ do mx-auto của container bên trong đảm nhiệm
  return (
    <header className="border-solid border-b border-b-gray-200 h-[60px] bg-white shadow-sm"> {/* Thêm bg-white và shadow nếu muốn nền header trắng */}
      {/* Container cho nội dung: Giới hạn chiều rộng, căn giữa, chứa nền trắng */}
      <div className="max-w-[1320px] mx-auto h-full px-4 sm:px-6 lg:px-8"> {/* px-* để có khoảng đệm nhỏ ở màn hình nhỏ */}
        {/* Nav: flex layout cho các mục bên trong container */}
        <nav
          className="flex items-center justify-between h-full" // items-center để căn dọc, justify-between để đẩy logo/search và buttons ra 2 bên
          aria-label="Main navigation"
        >
          {/* Phần bên trái: Logo và Search */}
          <div className="flex items-center gap-4"> {/* items-center căn dọc logo và search */}
            {/* Logo */}
            <div className="flex-shrink-0"> {/* Ngăn logo bị co lại */}
              {/* Có thể bỏ border-r nếu không cần thiết */}
              <a href="/" aria-label="Trang chủ">
                <img
                  // Đặt chiều cao cố định hoặc max-height thay vì aspect-ratio phức tạp
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b40865568aeafdd7562b3e8c22cfe92486a1cd7d?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                  alt="Company Logo"
                  className="h-8 w-auto" // Ví dụ: cao 32px, rộng tự động
                />
              </a>
            </div>

            {/* Search */}
            <div className="hidden md:block"> {/* Ẩn search trên màn hình nhỏ nếu muốn */}
              <form className="relative" role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search" className="sr-only">
                  Tìm truyện
                </label>
                {/* Icon đặt absolute bên trong input relative */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  id="search"
                  // class input gọn gàng hơn
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Tìm truyện"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Button submit ẩn nhưng vẫn có thể dùng để submit form */}
                 <button type="submit" className="sr-only">Search</button>
              </form>
            </div>
          </div>

          {/* Phần bên phải: Notifications và Auth Buttons */}
          <div className="flex items-center gap-4">
             {/* Nút search cho mobile (nếu cần) */}
             <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                <span className="sr-only">Tìm kiếm</span>
                <FiSearch className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              aria-label="Thông báo"
            >
              <FiBell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-1.5 text-sm">
              <button
                className="px-3 py-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                onClick={() => {}}
              >
                Đăng nhập
              </button>
              <button
                className="px-3 py-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                onClick={() => {}}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
    // </div > // Kết thúc div bao ngoài (nếu có)
  );
}