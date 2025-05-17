import React from 'react';
import CheckboxGroup from './CheckboxGroup';
import TagInput from './TagInput';
import { FiSearch, FiX } from 'react-icons/fi';

const MOCK_GENRES = [
  { id: 3, label: 'Xuyên Sách' },
  { id: 4, label: 'Trọng Sinh' },
  { id: 5, label: 'Xuyên Không' },
  { id: 6, label: 'Hệ Thống' },
  { id: 7, label: 'Showbiz' },
  { id: 8, label: 'Sảng Văn' },
  { id: 9, label: 'Ngược' },
  { id: 10, label: 'Ngược Luyến Tàn Tâm' },
  { id: 11, label: 'Đọc Tâm' },
];


const STATUS_OPTIONS = [
  { id: 28, label: 'Đã đủ bộ' },
  { id: 35, label: 'Đang phát hành' },
  { id: 36, label: 'Tạm ngưng' },
];

const OFFICIAL_OPTIONS = [
  { id: 1, label: 'Nguyên sang' },
  { id: 2, label: 'Diễn sinh' },

];

const GENDER_TARGET_OPTIONS = [
  { id: 12, label: 'Ngôn Tình' },
  { id: 13, label: 'Đam Mỹ' },
  { id: 14, label: 'Bách Hợp' },
  { id: 15, label: 'Nam sinh' },
  { id: 16, label: 'Không CP' },
];

const AGE_OPTIONS = [
  { id: 17, label: 'Cổ Đại' },
  { id: 18, label: 'Cận Đại' },
  { id: 19, label: 'Hiện Đại' },
  { id: 20, label: 'Tương Lai' },
  { id: 21, label: 'Niên Đại' },
];

const ENDING_OPTIONS = [
  { id: 22, label: 'HE' },
  { id: 23, label: 'SE' },
  { id: 24, label: 'OE' },
  { id: 25, label: 'BE' },
];

// const MOCK_GENRES = [
//   { id: 3, label: 'Xuyên Sách' },
//   { id: 4, label: 'Trọng Sinh' },
//   { id: 5, label: 'Xuyên Không' },
//   { id: 6, label: 'Hệ Thống' },
//   { id: 7, label: 'Showbiz' },
//   { id: 8, label: 'Sảng Văn' },
//   { id: 9, label: 'Ngược' },
//   { id: 10, label: 'Ngược Luyến Tàn Tâm' },
//   { id: 11, label: 'Đọc Tâm' },
// ];


export default function SearchForm({
  filters,      // Object chứa tất cả state của filter
  setFilters,   // Hàm để cập nhật state filters
  onSubmit,
  onReset,
  isLoading,
  availableGenres, // Danh sách thể loại từ API
  availableTags    // Danh sách tag từ API
}) {

const availableExclusive = [
  ...(availableTags || []),
  ...(availableGenres || []),
  ...ENDING_OPTIONS,
  ...AGE_OPTIONS,
  ...GENDER_TARGET_OPTIONS,
  ...OFFICIAL_OPTIONS,
  ...STATUS_OPTIONS
];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (filterKey, value) => {
    const numericValue = Number(value); 
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(numericValue)
        ? prev[filterKey].filter(item => item !== numericValue)
        : [...prev[filterKey], numericValue]
    }));
  };

  const handleTagToggle = (filterKey, tagId) => {
      setFilters(prev => ({
        ...prev,
        [filterKey]: prev[filterKey].includes(tagId)
            ? prev[filterKey].filter(id => id !== tagId)
            : [...prev[filterKey], tagId]
      }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-8 space-y-1">
      {/* Ô nhập keyword */}
      <div className="relative mb-4">
        <input
          type="text"
          name="keyword"
          placeholder="Nhập tên truyện, tác giả..."
          value={filters.keyword}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-sky-600 dark:text-sky-400 hover:text-sky-700">
          <FiSearch className="w-5 h-5" />
        </button>
      </div>

      <CheckboxGroup title="Tình trạng" options={STATUS_OPTIONS} selectedValues={filters.status} onChange={(e) => handleCheckboxChange('status', e.target.value)} name="status"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>
      <CheckboxGroup title="Tính chất" options={OFFICIAL_OPTIONS} selectedValues={filters.officialType} onChange={(e) => handleCheckboxChange('officialType', e.target.value)} name="officialType"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>
      <CheckboxGroup title="Loại truyện" options={GENDER_TARGET_OPTIONS} selectedValues={filters.genderTarget} onChange={(e) => handleCheckboxChange('genderTarget', e.target.value)} name="genderTarget"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>
      <CheckboxGroup title="Thời đại" options={AGE_OPTIONS} selectedValues={filters.age} onChange={(e) => handleCheckboxChange('age', e.target.value)} name="age"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>
      <CheckboxGroup title="Kết thúc" options={ENDING_OPTIONS} selectedValues={filters.ending} onChange={(e) => handleCheckboxChange('ending', e.target.value)} name="ending"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>

      <CheckboxGroup title="Thể loại" options={availableGenres} selectedValues={filters.genres} onChange={(e) => handleCheckboxChange('genres', e.target.value)} name="genres" gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"/>
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>

      <TagInput title="Tag (bao gồm)" availableTags={availableTags} selectedTags={filters.tags} onTagToggle={(tagId) => handleTagToggle('tags', tagId)} />
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>
      <TagInput title="Tag (loại trừ)" availableTags={availableExclusive} selectedTags={filters.excludedTags} onTagToggle={(tagId) => handleTagToggle('excludedTags', tagId)} inputPlaceholder="Nhập để tìm tag loại trừ..." />
      <div className="border-t border-gray-200 dark:border-gray-700 !mt-3 !mb-3"></div>

      <div>
        <label htmlFor="totalChapters" className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Độ dài (số chương):</label>
        <select
          id="totalChapters"
          name="totalChapters"
          value={filters.totalChapters}
          onChange={handleInputChange}
          className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Tất cả</option>
          <option value="1">1 - 20</option>
          <option value="2">21 - 50</option>
          {/* ... các option khác ... */}
          <option value="8">1000+</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-5">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md border border-sky-600 bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? <FiLoader className="animate-spin w-4 h-4"/> : <FiSearch className="w-4 h-4" />}
          Tìm truyện
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
        >
          <FiX className="w-4 h-4"/>
          Đặt lại
        </button>
      </div>
    </form>
  );
}