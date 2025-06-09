import React from 'react';

const formatRelativeTime = (isoTimeString) => {
    if (!isoTimeString) return '';
    const date = new Date(isoTimeString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return Math.floor(seconds) + " giây trước";
};

export default function CommentItem({ comment, onReply }) { // Nhận hàm onReply để xử lý trả lời
  console.log("Rendering CommentItem:", comment);
  if (!comment) return null;

  const defaultAvatar = '/img/no-image.png'; // Ảnh đại diện mặc định

  return (
    <li className="flex items-start space-x-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={comment.user?.avatarUrl || defaultAvatar}
          alt={comment.user?.name || 'User'}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
        />
      </div>
      {/* Nội dung bình luận */}
      <div className="flex-grow">
        <div className="text-sm">
          <span className="font-semibold text-gray-900 dark:text-white mr-2">
            {comment.user?.name || 'Người dùng ẩn danh'}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"> {/* Giữ lại xuống dòng */}
          {comment.content}
        </p>
        <div className="mt-1.5 flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatRelativeTime(comment.createdAtISO)}</span>
          <button
            onClick={() => onReply(comment.id, comment.user?.name)} // Truyền ID và tên user để reply
            className="font-medium hover:text-sky-600 dark:hover:text-sky-400"
          >
            Trả lời
          </button>
        </div>

         {/* Khu vực hiển thị các bình luận trả lời (replies) --- */}
         {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-2 space-y-2 pl-5 border-l border-gray-200 dark:border-gray-700">
              {comment.replies.map(reply => (
                 <CommentItem key={reply.id} comment={reply} onReply={onReply} />
              ))}
            </ul>
          )}
      </div>
    </li>
  );
}