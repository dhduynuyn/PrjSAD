import React from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
export default function CommentForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  currentUserAvatar, // Avatar của user hiện tại để hiển thị
  placeholder = "Nhập bình luận của bạn (tiếng Việt có dấu)..."
}) {
  const defaultAvatar = '/img/avata.png';

  return (
    <form onSubmit={onSubmit} className="flex items-start space-x-3 mt-4">
      <img
        src={currentUserAvatar || defaultAvatar}
        alt="Your Avatar"
        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
      />
      <div className="flex-grow flex items-center border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 overflow-hidden">
        <textarea
          name="commentContent"
          rows="2" 
          className="block w-full px-3 py-2 text-sm border-0 resize-none focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" // Bỏ border và focus ring mặc định
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          disabled={isSubmitting} // Vô hiệu hóa khi đang gửi
        />
        <button
          type="submit"
          className="p-3 text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !value.trim()} // Vô hiệu hóa khi đang gửi hoặc chưa nhập gì
        >
          {isSubmitting ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5" /> 
          )}
          <span className="sr-only">Gửi bình luận</span>
        </button>
      </div>
    </form>
  );
}