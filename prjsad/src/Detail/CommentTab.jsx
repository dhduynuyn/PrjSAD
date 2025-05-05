import React, { useState, useEffect } from 'react';
import CommentList from '../cmt-of-detail/CommentList';
import CommentForm from '../cmt-of-detail/CommentForm';
//import { getCommentsApi, postCommentApi } from '../api/commentApi'; // Giả lập API functions
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

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

export default function CommentTab({ storyId }) {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { commentId: xxx, userName: 'yyy' }
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Lấy user hiện tại từ context
  const navigate = useNavigate();

  // --- Fetch Comments ---
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Thay bằng API thật ---
      // const response = await getCommentsApi(storyId);
      // Giả lập API response
       const response = await new Promise(resolve => setTimeout(() => resolve({
          data: [
              { id: 51582, user: { name: 'uyen', avatarUrl: 'https://monkeyd.net.vn/img/avata.png' }, content: 'Hay quá', createdAtISO: new Date(Date.now() - 1000).toISOString(), replies: [] },
              { id: 51583, user: { name: 'Another User', avatarUrl: null }, content: 'Bình luận thử nghiệm\nDòng thứ hai.', createdAtISO: new Date(Date.now() - 5 * 60000).toISOString(), replies: [] },
          ],
          meta: { total: 2 } // Tổng số bình luận từ API
      }), 1000));

      setComments(response.data || []);
      setTotalComments(response.meta?.total || response.data?.length || 0);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
      setComments([]);
      setTotalComments(0);
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (storyId) {
      fetchComments();
    } else {
        setIsLoading(false); // Không có storyId thì không load
    }
  }, [fetchComments, storyId]); // Fetch lại khi storyId thay đổi

  // --- Handle New Comment Input ---
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // --- Handle Comment Submit ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để bình luận.");
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return; // Không gửi nếu trống

    setIsSubmitting(true);
    setError(null);

    try {
      // Thay bằng API thật ---
      // const commentData = { content: newComment, parentId: replyingTo?.commentId || null };
      // const postedComment = await postCommentApi(storyId, commentData);

      // Giả lập API response trả về comment vừa post
       const postedComment = {
           id: Math.random().toString(36).substring(7), // ID giả
           user: { name: user.name, avatarUrl: user.avatar }, // Lấy từ context
           content: newComment,
           createdAtISO: new Date().toISOString(),
           replies: []
       };

      setComments(prevComments => [postedComment, ...prevComments]);
      setTotalComments(prev => prev + 1); // Tăng tổng số
      setNewComment(''); // Xóa nội dung form
      setReplyingTo(null); // Reset trạng thái trả lời

    } catch (err) {
      console.error("Failed to post comment:", err);
      setError("Gửi bình luận thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle Reply Click ---
  const handleReply = (commentId, userName) => {
    setReplyingTo({ commentId, userName });
    // document.getElementById('commentTextArea')?.focus();
    setNewComment(`@${userName} `); // Thêm tag @ vào đầu comment
  };

  // --- Render ---
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {totalComments.toLocaleString()} bình luận
      </p>

      {/* Form bình luận */}
      {isAuthenticated ? (
        <CommentForm
          value={newComment}
          onChange={handleCommentChange}
          onSubmit={handleCommentSubmit}
          isSubmitting={isSubmitting}
          currentUserAvatar={user?.avatar}
          placeholder={replyingTo ? `Trả lời ${replyingTo.userName}...` : "Nhập bình luận của bạn..."}
        />
      ) : (
         <p className="text-sm text-center text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-600 p-4 rounded-lg">
            Vui lòng <Link to="/login" className="text-sky-600 hover:underline">Đăng nhập</Link> để bình luận.
         </p>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}


      {/* Danh sách bình luận */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <FiLoader className="animate-spin text-3xl text-sky-600" />
          </div>
        ) : (
          <CommentList comments={comments} onReply={handleReply} />
        )}
      </div>

    </div>
  );
}
