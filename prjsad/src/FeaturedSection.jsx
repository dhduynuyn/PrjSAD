import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaUser } from "react-icons/fa"; 

// Dữ liệu mẫu (Trong thực tế, bạn sẽ fetch dữ liệu này từ API)
const storiesData = [
  {
    id: 1,
    title: "Cha mỹ nhân của ta hắc hoá rồi",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/22/1745292879-cha-my-nhan-cua-ta-hac-hoa-roi.jpg",
    description: "Xuyên không đến thời cổ đại, Khương Dao nhận được một thân thế đầy buff: một người cha mỹ mạo nh..",
    authorName: "Thế Giới Tiểu Thuyết",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/44605",
    slug: "cha-my-nhan-cua-ta-hac-hoa-roi", 
    storyUrl: "/truyen/cha-my-nhan-cua-ta-hac-hoa-roi", 

  },
  {
    id: 2,
    title: "SAU KHI BỊ VỨT BỎ THÊ THẢM, TÔI ĐƯỢC PHẢN DIỆN CƯNG CHIỀU SỦNG ÁI",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/15/1742053860-sau-khi-bi-vut-bo-the-tham-toi-duoc-phan-dien-cung-chieu-sung-ai.jpg",
    description: "[Bối cảnh mạt thế giả tưởng + Trừng phạt tra nam + phản diện soán ngôi + tu la tràng + cứu ..",
    authorName: "Mắm Muối Chanh Đường",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/4915",
    storyUrl: "https://monkeyd.net.vn/sau-khi-bi-vut-bo-the-tham-toi-duoc-phan-dien-cung-chieu-sung-ai.html",
  },
  {
    id: 3,
    title: "Viên Kẹo Ngọt Ngào Nhất",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/02/25/1740490949-vien-keo-ngot-ngao-nhat.jpg",
    description: "Edit: Yêu Phi ☆⋆꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷‧★ Để trả thù chồng cũ, sau khi ly hôn, tôi kết hôn ..",
    authorName: "Yêu Phi Họa Quốc",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/287",
    storyUrl: "https://monkeyd.net.vn/vien-keo-ngot-ngao-nhat.html",
  },
  {
    id: 4,
    title: "YÊN CHI NỮ",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745661084-yen-chi-nu.jpg",
    description: "Trước kia, làng tôi thường vứt những bé gái không muốn nuôi vào rừng cho rắn ăn. ..",
    authorName: "Thiên Phong Tự Tuyết",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/37858",
    storyUrl: "https://monkeyd.net.vn/yen-chi-nu.html",
  },
  {
    id: 5,
    title: "Tiểu sư muội nói Thần kinh cũng là Thần",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2024/12/06/1733496669-tieu-su-muoi-noi-than-kinh-cung-la-than.jpg",
    description: "Tên truyện: Tiểu sư muội nói Thần kinh cũng là Thần. Tên gốc: 小师妹说神经也是神 Tác..",
    authorName: "Thu Vũ Miên Miên",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/26969",
    storyUrl: "https://monkeyd.net.vn/tieu-su-muoi-noi-than-kinh-cung-la-than.html",
  },
   {
    id: 6,
    title: "Thiên Kim Thật Là Ai",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745625589-thien-kim-that-la-ai.jpg",
    description: "Một ngày nọ, cô con gái ruột thật sự bỗng nhiên tìm tới cửa, ôm lấy chân mẹ tôi khóc ròng, nói r..",
    authorName: "Tiểu Soái thích Zhihu",
    authorUrl: "https://monkeyd.net.vn/nhom-dich/36629",
    storyUrl: "https://monkeyd.net.vn/thien-kim-that-la-ai.html",
   },
  // Thêm các truyện khác vào đây...
];

// Hàm chia mảng thành các nhóm nhỏ
const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export default function FeaturedSection() {
  // Chia dữ liệu thành các nhóm, mỗi nhóm 3 truyện
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
                            className="h-32 w-24 object-cover shadow-lg rounded" // Tailwind classes cho ảnh
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