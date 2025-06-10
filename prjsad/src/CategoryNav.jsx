import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

// Import các icon cần thiết từ BoxIcons (bx) trong react-icons
import { BsListOl, BsChevronDown, BsStar, BsPeople, BsVolumeUp } from 'react-icons/bs'; // Hoặc sử dụng các icon tương ứng từ react-icons/bi nếu muốn giống hệt Boxicons

// Dữ liệu thể loại (ví dụ, bạn có thể lấy từ API hoặc hardcode)
const categories = [
    { name: "Bách Hợp", href: "https://www.monkeyd.com.vn/the-loai/bach-hop.html" },
    { name: "BE", href: "https://www.monkeyd.com.vn/the-loai/be.html" },
    { name: "Chữa Lành", href: "https://www.monkeyd.com.vn/the-loai/chua-lanh.html" },
    // ... Thêm các thể loại khác vào đây
    { name: "Xuyên Sách", href: "https://www.monkeyd.com.vn/the-loai/xuyen-sach.html" },
];

export default function CategoryNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref để phát hiện click bên ngoài dropdown

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Thêm event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    // Sử dụng padding và border giống bản gốc hơn
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Container để căn giữa và giới hạn chiều rộng */}
      <div className="container mx-auto px-4"> {/* Điều chỉnh px-4 nếu cần */}
        {/* Sử dụng ul và flex để sắp xếp các mục menu */}
        <ul className="flex items-center space-x-1 text-sm font-medium text-gray-700 h-14"> {/* Giảm cỡ chữ, thêm chiều cao cố định nếu muốn */}

          {/* Trang chủ */}
          <li className="nav-item">
            <a
              href="http://localhost:5173/"
              className="nav-link px-3 py-2 flex items-center rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
            >
              Trang chủ
            </a>
          </li>

          {/* Truyện mới */}
          <li className="nav-item">
            <Link to="/stories/truyen-moi" className="nav-link">Truyện Mới</Link>
          </li>

          {/* Thể loại (Dropdown) */}
          <li className="nav-item relative" ref={dropdownRef}> {/* Thêm relative và ref */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="nav-link px-3 py-2 flex items-center gap-x-1.5 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150 w-full text-left"
            >
              <BsListOl size={18} /> {/* Icon Thể loại */}
              <span>Thể loại</span>
              <BsChevronDown size={16} className={`ml-auto transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} /> {/* Icon Dropdown */}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="dropdown-menu absolute left-0 mt-1 w-60 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 max-h-80 overflow-y-auto"> {/* Kiểu dáng dropdown */}
                {categories.map((category) => (
                   <li key={category.name}>
                     <a
                       className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                       href={category.href}
                     >
                       <span className="ml-2">{category.name}</span> {/* Thêm ml-2 nếu dùng icon */}
                     </a>
                   </li>
                ))}
              </ul>
            )}
          </li>

          {/* Truyện Full */}
          <li className="nav-item">
            <Link to="/stories/truyen-hoan-thanh" className="nav-link">Truyện Full</Link>
          </li>
          {/* Team */}
          <li className="nav-item">
            <Link
              to="/teams"
              className="nav-link px-3 py-2 flex items-center gap-x-1.5 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
            >
              <BsPeople size={18} /> {/* Icon Team */}
              Team
            </Link>
          </li>

          {/* Tìm kiếm nâng cao */}
          <li className="nav-item">
            <Link
              to="/tim-kiem-nang-cao"
              className="nav-link px-3 py-2 flex items-center rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
            >
              Tìm kiếm nâng cao
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}