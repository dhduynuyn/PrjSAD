import React from 'react';

export default function ChapterContent({ content, textSettings }) {
  // textSettings là object chứa { fontSize, lineHeight, fontFamily, textColor, backgroundColor }
  // Ví dụ style dựa trên textSettings
  const contentStyle = {
    fontSize: `${textSettings?.fontSize || 18}px`, 
    lineHeight: textSettings?.lineHeight || 1.8,   
    fontFamily: textSettings?.fontFamily || 'inherit', 
    color: textSettings?.textColor, 
  };

  if (!content) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-10">Nội dung chương đang được cập nhật...</p>;
  }

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
      style={contentStyle}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}