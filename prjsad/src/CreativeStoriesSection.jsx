import React from 'react';

// Dữ liệu mẫu (thay thế bằng dữ liệu thực tế của bạn)
const stories = [
  {
    id: 1,
    title: "Ánh Dương Không Hoen Gỉ",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/26/1742987382-anh-duong-khong-hoen-gi.jpg",
    url: "https://monkeyd.net.vn/anh-duong-khong-hoen-gi.html",
  },
  {
    id: 2,
    title: "Bướm Quỷ",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/01/1743490390-buom-quy.jpg",
    url: "https://monkeyd.net.vn/buom-quy.html",
  },
  {
    id: 3,
    title: "Hai Anh Chồng Từ Địa Phủ",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2024/11/27/1732714291-hai-anh-chong-tu-dia-phu.jpg",
    url: "https://monkeyd.net.vn/hai-anh-chong-tu-dia-phu.html",
  },
  {
    id: 4,
    title: "Vết Nứt Con Tim",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2024/05/19/1716090715-vet-nut-con-tim.jpg",
    url: "https://monkeyd.net.vn/vet-nut-con-tim.html",
  },
  {
    id: 5,
    title: "Xuyên Thành Phản Diện Độc Nhất Của Nam Chính",
    imageUrl: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/23/1745407218-xuyen-thanh-phan-dien-doc-nhat-cua-nam-chinh.jpg",
    url: "https://monkeyd.net.vn/xuyen-thanh-phan-dien-doc-nhat-cua-nam-chinh.html",
  },
  // Thêm các truyện khác nếu cần
];

// Component Story Item để tái sử dụng
function StoryItem({ story }) {
  const placeholderImage = "https://monkeyd.net.vn/img/ajax-loading.gif";
  const fallbackImage = "https://monkeyd.net.vn/img/no-image.png";

  const handleImageError = (event) => {
    event.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh fallback cũng lỗi
    event.target.src = fallbackImage;
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* single-story-block equivalent */}
      <div className="w-full"> {/* single-story-wrap equivalent */}
        <div className="relative w-full overflow-hidden rounded-md aspect-[200/260] bg-gray-200"> {/* single-story-img equivalent - added aspect ratio, overflow, rounded */}
          <a href={story.url}>
            <img
              src={placeholderImage} // Hiển thị placeholder ban đầu
              data-src={story.imageUrl} // Lazy load sẽ dùng cái này
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover lazyload" // Dùng object-cover, absolute positioning để fill div
              width="200" // Giữ lại để trình duyệt biết kích thước
              height="260"// Giữ lại để trình duyệt biết kích thước
              onError={handleImageError} // Xử lý lỗi ảnh
              loading="lazy" // Thêm lazy loading cơ bản của trình duyệt
            />
          </a>
        </div>
      </div>
      <div className="mt-2 w-full"> {/* single-story-details equivalent */}
        <h3 className="text-sm sm:text-base font-medium tracking-wide leading-tight text-black hover:text-sky-500 transition-colors duration-200">
          <a href={story.url} className="line-clamp-2"> {/* Giới hạn 2 dòng */}
            {story.title}
          </a>
        </h3>
      </div>
    </div>
  );
}


export default function CreativeStoriesSection() {
  // Giả sử màu primary là màu xanh nhạt giống monkeyd (hoặc màu bạn muốn)
  // Thay thế bằng màu thực tế nếu có trong tailwind.config.js, ví dụ: bg-primary
  const primaryBgColor = "bg-sky-50"; // Hoặc màu khác như bg-blue-50, bg-gray-100...

  return (
    <section className="creative-stories-home mt-5"> {/* Giữ class gốc nếu cần */}
      <div className="container mx-auto px-4"> {/* Container tương tự Bootstrap */}
        {/* div tương đương slider-recommend-right background-primary */}
        <div className={`${primaryBgColor} p-4 md:p-6 rounded-md shadow-sm`}>
          {/* div tương đương total-item-show */}
          <div className="flex flex-wrap gap-y-2 justify-between items-center mb-3">
            {/* Sử dụng h5 giống gốc */}
            <h5 className="flex items-center text-lg md:text-xl font-medium leading-tight uppercase text-neutral-800">
              {/* Thay icon bằng SVG hoặc font icon nếu có */}
              {/* <i className="bx bx-star mr-2"></i> */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className="w-5 h-5 mr-2 text-yellow-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 21.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              <span>Truyện Sáng Tác</span>
            </h5>
            <a href="https://monkeyd.net.vn/truyen-sang-tac.html" className="px-3 py-1 text-xs sm:text-sm text-sky-600 border border-sky-600 hover:bg-sky-600 hover:text-white transition-colors duration-200 rounded-full">
              Xem thêm
            </a>
          </div>

          {/* hr */}
          <hr className="border-t border-gray-300 mb-4" />

          {/* div tương đương card */}
          <div className="card bg-white p-4 md:p-5 rounded-md shadow-inner"> {/* Thêm shadow-inner nếu muốn hiệu ứng lõm vào */}
              {/* div tương đương card-body */}
              {/* Grid layout thay cho Owl Carousel */}
              {/* Điều chỉnh số cột cho các màn hình khác nhau */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-5">
                {stories.map((story) => (
                  <StoryItem key={story.id} story={story} />
                ))}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}