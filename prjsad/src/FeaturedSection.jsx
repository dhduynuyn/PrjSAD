import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchStoriesAdvancedApi } from './Search/searchApi';
import { FaUser } from "react-icons/fa";

// Hàm chia mảng thành các nhóm nhỏ
const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export default function FeaturedSection() {
  const [storiesData, setStoriesData] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await searchStoriesAdvancedApi({ sort: 'hot' }); // Gửi các tham số cần thiết nếu có
        const stories = response?.data || []; // Tùy vào cấu trúc phản hồi của bạn

        console.log("Fetched stories:", stories); // Kiểm tra dữ liệu nhận được
        // Chuyển đổi dữ liệu API về định dạng mong muốn
        const formattedStories = stories.slice(0, 6).map((story) => ({
          id: story.id,
          title: story.title,
          imageUrl: story.coverUrl || "https://monkeyd.net.vn/img/no-image.png",
          description: story.description || "",
          authorName: story.translatorTeam?.name || "Không rõ",
          slug: story.id,
          authorUrl: `/${story.translatorTeam.url || 'unknown'}`,
          storyUrl: `/truyen/${story.id}`,
        }));

        setStoriesData(formattedStories);
      } catch (error) {
        console.error("Lỗi khi tải truyện đề cử:", error);
      }
    };

    fetchStories();
  }, []);

  const groupedStories = chunkArray(storiesData, 3);

  // Cấu hình cho react-slick
  const settings = {
    dots: true, // Hiển thị dấu chấm điều hướng
    infinite: true, // Lặp vô hạn
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 1, // Hiển thị 1 nhóm (slide) tại một thời điểm
    slidesToScroll: 1, // Chuyển 1 nhóm (slide) mỗi lần
    autoplay: true, // Tự động chạy
    autoplaySpeed: 5000, // Thời gian giữa các lần tự động chuyển (ms)
    pauseOnHover: true, // Tạm dừng khi di chuột vào
    // Thêm các tùy chỉnh khác nếu cần, ví dụ: responsive
     responsive: [
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Ẩn mũi tên trên mobile nếu muốn
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Ẩn mũi tên trên mobile nếu muốn
        }
      }
    ],
     // Custom Paging cho dots giống mẫu hơn (tùy chọn)
     dotsClass: "slick-dots custom-dots-featured", // Thêm class để custom CSS
     appendDots: dots => (
        <div>
            <ul> {dots} </ul>
        </div>
     ),
     customPaging: i => (
       <button className="focus:outline-none">
         {/* Nút tròn nhỏ */}
       </button>
     )
  };

  // Xử lý lỗi ảnh
  const handleImageError = (e) => {
    e.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh fallback cũng lỗi
    e.target.src = 'https://monkeyd.net.vn/img/no-image.png'; // Đường dẫn ảnh mặc định
  };

  return (
    <section className="mb-6">
      <h2 className="z-10 self-start text-xl font-medium tracking-wide leading-tight uppercase text-neutral-700">
        Đề cử hôm nay
      </h2>
      <div className="border-solid border-t-[1px] border-t-gray-300 opacity-50 mt-3 mb-4" /> {/* Thay đổi màu và opacity nếu muốn */}

      {/* Container giống card */}
      <div className="bg-white rounded-md shadow-md overflow-hidden"> {/* Thêm overflow-hidden để bo góc hoạt động đúng với slider */}
        <div className="p-4 md:p-6"> {/* Padding giống card-body */}
          {/* Slider */}
          <Slider {...settings}>
            {groupedStories.map((group, groupIndex) => (
              // Mỗi group là một slide
              <div key={groupIndex} className="px-2"> {/* Thêm padding ngang cho mỗi slide để tạo khoảng cách */}
                <div className="grid grid-cols-1 gap-y-4"> {/* Grid giống trong mẫu */}
                  {group.map((story) => (
                    // Mỗi story item
                    <div key={story.id} className="flex space-x-3"> {/* Giống d-flex space-x-3 */}
                      {/* Image container */}
                      <div className="flex-shrink-0">
                        <a href={story.storyUrl} title={story.title}>
                          <img
                            // loading="lazy" // Bật lazy loading của trình duyệt
                            onError={handleImageError}
                            className="h-32 w-24 object-cover shadow-lg rounded"
                            alt={story.title}
                            src={story.imageUrl} // Sử dụng src trực tiếp hoặc data-src với thư viện lazy load khác
                            // data-src={story.imageUrl} // Nếu dùng lazyload library
                            // width="96" height="128" // Có thể thêm width/height để tối ưu CLS
                          />
                        </a>
                      </div>
                      {/* Content container */}
                      <div className="flex flex-col space-y-1 flex-grow min-w-0"> {/* Thêm flex-grow và min-w-0 để text xuống dòng đúng */}
                        {/* Title */}
                        <div>
                          <a
                            href={story.storyUrl}
                            title={story.title}
                            className="text-sm md:text-base font-bold text-slate-800 hover:text-blue-600 line-clamp-2" // line-clamp để giới hạn 2 dòng
                          >
                            {story.title}
                          </a>
                        </div>
                        {/* Description */}
                        <div className="text-xs md:text-sm text-gray-500 line-clamp-2 md:line-clamp-3"> {/* line-clamp giới hạn dòng */}
                          {story.description}
                        </div>
                        {/* Author */}
                        <div className="flex items-center space-x-1 pt-1 text-xs md:text-sm text-gray-600">
                           {/* Icon (sử dụng react-icons) */}
                           <FaUser className="inline-block mr-1" />
                          <a href={story.authorUrl} title={story.authorName} className="hover:text-blue-600 truncate"> {/* truncate nếu tên tác giả quá dài */}
                            {story.authorName}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
       {/* Thêm CSS Custom cho dots nếu cần */}
       <style jsx global>{`
        .custom-dots-featured ul {
          margin-top: 15px; /* Khoảng cách từ slider đến dots */
          padding: 0;
          display: flex;
          justify-content: center;
          list-style: none;
        }
        .custom-dots-featured li {
          margin: 0 4px; /* Khoảng cách giữa các dot */
        }
        .custom-dots-featured li button {
          width: 10px;
          height: 10px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background-color: #ccc; /* Màu dot không active */
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 0; /* Ẩn số trang mặc định */
        }
         .custom-dots-featured li button:hover {
           background-color: #aaa; /* Màu khi hover */
         }
        .custom-dots-featured li.slick-active button {
          background-color: #666; /* Màu dot active */
        }
      `}</style>
    </section>
  );
}