import React, { useState } from 'react';

export default function TagInput({
  availableTags = [],
  selectedTags,
  onTagToggle,
  title,
  inputPlaceholder = "Nhập để tìm tag..."
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hiển thị các tag đã chọn trước, sau đó đến các tag chưa chọn và được filter
  const sortedAndFilteredTags = [...availableTags].sort((a, b) => {
      const aSelected = selectedTags.includes(a.id);
      const bSelected = selectedTags.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
  }).filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));


  const tagsToShow = showAll ? sortedAndFilteredTags : sortedAndFilteredTags.slice(0, 15); // Giới hạn số tag hiển thị ban đầu

  return (
    <div>
      <h4 className="text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{title}:</h4>
      <input
        type="text"
        placeholder={inputPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md mb-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      {filteredTags.length === 0 && searchTerm && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Không tìm thấy tag nào khớp.</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-1.5 max-h-48 overflow-y-auto pr-1">
        {tagsToShow.map(tag => (
          <label key={tag.id} className="flex items-center space-x-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              value={tag.id}
              checked={selectedTags.includes(tag.id)}
              onChange={() => onTagToggle(tag.id)}
              className="form-checkbox h-3.5 w-3.5 text-sky-600 border-gray-300 rounded focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-sky-500"
            />
            <span className="text-gray-700 dark:text-gray-200 truncate" title={tag.name}>
                {tag.name} {tag.count ? `(${tag.count})` : ''}
            </span>
          </label>
        ))}
      </div>
      {sortedAndFilteredTags.length > 15 && !showAll && (
        <button
          type="button" // Quan trọng để không submit form
          onClick={() => setShowAll(true)}
          className="text-xs text-sky-600 dark:text-sky-400 hover:underline mt-1.5"
        >
          Hiện tất cả ({sortedAndFilteredTags.length})
        </button>
      )}
       {showAll && sortedAndFilteredTags.length > 15 && (
           <button
            type="button"
            onClick={() => setShowAll(false)}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline mt-1.5"
           >
               Ẩn bớt
           </button>
       )}
    </div>
  );
}