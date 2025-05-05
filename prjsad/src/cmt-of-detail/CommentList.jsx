import React from 'react';
import CommentItem from './CommentItem';

export default function CommentList({ comments, onReply }) {
  if (!comments || comments.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Chưa có bình luận nào.</p>;
  }

  return (
    <ul className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </ul>
  );
}