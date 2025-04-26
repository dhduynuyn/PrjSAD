// src/components/StoryCard.js
import React from "react";
import { BsEye, BsBookmark } from "react-icons/bs"; // Import icons

// Placeholder cho lazy loading và error handling đơn giản
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const placeholder = "https://monkeyd.net.vn/img/ajax-loading.gif"; // Hoặc ảnh placeholder của bạn
  const errorPlaceholder = "https://monkeyd.net.vn/img/no-image.png"; // Ảnh lỗi

  React.useEffect(() => {
    setImgSrc(src); // Cập nhật src khi prop thay đổi
  }, [src]);

  const handleLoad = (e) => {
     // Optional: Nếu muốn làm gì đó khi ảnh load thành công
  };

  const handleError = () => {
    setImgSrc(errorPlaceholder);
  };

  // Sử dụng src placeholder ban đầu nếu muốn hiệu ứng loading
  // Hoặc trực tiếp dùng imgSrc nếu không cần placeholder loading
  return (
    <img
      src={imgSrc || placeholder} // Hiển thị placeholder nếu imgSrc chưa có (hoặc dùng src trực tiếp)
      alt={alt}
      onError={handleError}
      onLoad={handleLoad} // Optional
      loading="lazy" // Bật lazy loading của trình duyệt
      {...props}
    />
  );
};


export default function StoryCard({
  image,
  title,
  chapter,
  time,
  views,
  bookmarks, // Thêm prop bookmarks
  isFull,
  storyUrl = "#", // Thêm URL cho truyện
  chapterUrl = "#", // Thêm URL cho chương
}) {
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Phần ảnh */}
      <div className="relative">
        <a href={storyUrl} className="block aspect-[3/4]"> {/* Tỷ lệ khung hình 3:4 */}
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover" // Đảm bảo ảnh cover đúng tỷ lệ
            // width="200" // Có thể bỏ width/height nếu dùng aspect ratio
            // height="260"
          />
        </a>

        {/* Meta data (Views, Bookmarks) */}
        <div className="absolute bottom-0 left-0 w-full px-2 pb-1 pt-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center space-x-3 text-white text-xs drop-shadow-sm">
            <span className="flex items-center">
              <BsEye className="w-3.5 h-3.5 mr-1" /> {views}
            </span>
            <span className="flex items-center">
              <BsBookmark className="w-3 h-3 mr-1" /> {bookmarks}
            </span>
          </div>
        </div>

        {/* Huy hiệu FULL */}
        {isFull && (
          <div className="absolute top-1 right-1">
            <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow">
              FULL
            </span>
          </div>
        )}
         {/* Bạn có thể thêm các huy hiệu khác như HOT, NEW tương tự */}
      </div>

      {/* Phần nội dung text */}
      <div className="p-2 flex flex-col flex-grow"> {/* flex-grow để đẩy phần dưới cùng xuống */}
         <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 mb-1 line-clamp-2" title={title}>
           <a href={storyUrl}>{title}</a>
         </h3>
         <div className="mt-auto text-xs text-gray-500"> {/* mt-auto để đẩy xuống đáy */}
           <div className="flex justify-between items-center">
             <span className="block truncate hover:text-blue-600" title={chapter}>
                <a href={chapterUrl}>{chapter}</a>
             </span>
             <span className="flex-shrink-0 ml-2">{time}</span>
           </div>
         </div>
      </div>
    </div>
  );
}