import React, { useState, useRef, useEffect } from 'react';

export default function StoryDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Giả sử chiều cao giới hạn là khoảng 6 dòng (tùy chỉnh line-height và font-size)
      const maxHeight = 6 * 1.5 * 16; // 6 lines * 1.5 line-height * 16px font-size (ước lượng)
      if (contentRef.current.scrollHeight > maxHeight) {
        setNeedsExpansion(true);
      } else {
          setNeedsExpansion(false); // Không cần nút nếu không tràn
          setIsExpanded(true); // Hiển thị toàn bộ nếu không tràn
      }
    }
  }, [description]); // Chạy lại khi description thay đổi

  if (!description) return null;

  return (
    <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
      <div
        ref={contentRef}
        className={`relative overflow-hidden whitespace-pre-line transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[10000px]' : 'max-h-36'
        } ${
          needsExpansion && !isExpanded
            ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-10 after:bg-gradient-to-t after:from-white after:dark:from-gray-800 after:to-transparent'
            : ''
        }`}
      >
        {description}
      </div>
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sky-600 dark:text-sky-400 hover:underline text-xs font-medium"
        >
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
}