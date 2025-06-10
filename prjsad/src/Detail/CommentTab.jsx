import React, { useState, useEffect , useCallback} from 'react';
import CommentList from '../cmt-of-detail/CommentList';
import CommentForm from '../cmt-of-detail/CommentForm';
//import { getCommentsApi, postCommentApi } from '../api/commentApi'; // Giả lập API functions
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';


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

function generateUniqueId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

function mapCommentData(commentsRaw = [], depth = 0) {
  return commentsRaw.map((comment, index) => {
    return {
      id: comment.id || generateUniqueId(`c-${depth}-${index}-`),
      user: {
        name: comment.username,
        avatarUrl: comment.profile_image
          ? `data:image/jpeg;base64,${comment.profile_image}`
          : null,
      },
      content: comment.message,
      createdAtISO: comment.timestamp,
      replies: mapCommentData(comment.replies || [], depth + 1),
    };
  });
}


export default function CommentTab({ storyId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [totalComments, setTotalComments] = useState(initialComments?.length || 0);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { commentId: xxx, userName: 'yyy' }
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Lấy user hiện tại từ context
  const navigate = useNavigate();

  // --- Fetch Comments ---
  const fetchComments = useCallback(() => {
    console.log("Fetching comments for storyId:", initialComments);
    setIsLoading(true);
    setError(null);

    try {
      const formattedComments = mapCommentData(initialComments, 0);
      setComments(formattedComments || []);
      setTotalComments(formattedComments?.length || 0);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
      setComments([]);
      setTotalComments(0);
    } finally {
      setIsLoading(false);
    }
  }, [initialComments]); // Phụ thuộc vào initialComments


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

  function addReplyToComments(comments, parentId, newReply) {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [newReply, ...(comment.replies || [])],
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComments(comment.replies, parentId, newReply),
      };
    }
    return comment;
  });
}

  // --- Handle Comment Submit ---
  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!isAuthenticated) {
    alert("Vui lòng đăng nhập để bình luận.");
    navigate('/login');
    return;
  }
  if (!newComment.trim()) return;

  setIsSubmitting(true);
  setError(null);

  try {
    const postedComment = {
      id: Math.random().toString(36).substring(7),
      user: { name: user.name, avatarUrl: user?.avatar || '/img/no-image.png' },
      content: newComment,
      createdAtISO: new Date().toISOString(),
      replies: []
    };

    if (replyingTo) {
    setComments(prev => addReplyToComments(prev, replyingTo.commentId, postedComment));
    } else {
      setComments(prev => [postedComment, ...prev]);
    }


    setTotalComments(prev => prev + 1);
    setNewComment('');
    setReplyingTo(null);
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
      {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {totalComments.toLocaleString()} bình luận
      </p> */}

      {/* Form bình luận */}
      {isAuthenticated ? (
        <CommentForm
          value={newComment}
          onChange={handleCommentChange}
          onSubmit={handleCommentSubmit}
          isSubmitting={isSubmitting}
          currentUserAvatar={user?.profile_image || (user.profile_image ? `data:image/jpeg;base64,${user.profile_image}` : '/img/no-image.png')}
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
