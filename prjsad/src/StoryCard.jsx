import React from "react";
import { BsEye, BsBookmark } from "react-icons/bs";
import { FiTrash2 } from 'react-icons/fi'; 

// Component hiển thị ảnh từ base64 hoặc URL
const ImageWithFallback = ({ src, alt, isBase64 = false, ...props }) => {
  const placeholder = "https://monkeyd.net.vn/img/ajax-loading.gif";
  const errorPlaceholder = "https://monkeyd.net.vn/img/no-image.png";
  const [imgSrc, setImgSrc] = React.useState(
    isBase64 && src ? `data:image/jpeg;base64,${src}` : src
  );

  React.useEffect(() => {
    if (isBase64 && src) {
      setImgSrc(`data:image/jpeg;base64,${src}`);
    } else {
      setImgSrc(src);
    }
  }, [src, isBase64]);

  const handleError = () => {
    setImgSrc(errorPlaceholder);
  };

  return (
    <img
      src={imgSrc || placeholder}
      alt={alt}
      onError={handleError}
      loading="lazy"
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
  bookmarks,
  isFull,
  storyUrl = "#",
  chapterUrl = "#",
  onDelete, 
})
 {
    const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Phần ảnh */}
      <div className="relative">
        <a href={storyUrl} className="block aspect-[3/4]">
          <ImageWithFallback
            src={image}
            alt={title}
            isBase64={true} // ✅ quan trọng: bật chế độ base64
            className="w-full h-full object-cover"
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

        {/* === NÚT XÓA (CHỈ HIỂN THỊ KHI CÓ onDelete) === */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 focus:opacity-100"
            aria-label="Xóa khỏi danh sách"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 mb-1 line-clamp-2" title={title}>
          <a href={storyUrl}>{title}</a>
        </h3>
        <div className="mt-auto text-xs text-gray-500">
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
