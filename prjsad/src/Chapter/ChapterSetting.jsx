import React from 'react';

export default function ChapterSettings({ isOpen, onClose, settings, onSettingsChange }) {
  if (!isOpen) return null;

  const fontFamilies = [
    { name: 'Mặc định', value: 'inherit' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: "'Times New Roman', serif" },
    { name: 'Georgia', value: 'Georgia, serif' },
    // Thêm các font khác
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: name === 'fontSize' || name === 'lineHeight' ? parseFloat(value) : value });
  };

  const handleColorChange = (type, color) => {
      onSettingsChange({ ...settings, [type]: color });
  }

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
      {/* Modal Content */}
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md z-50"
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Cài đặt hiển thị</h3>
        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cỡ chữ: {settings.fontSize || 18}px
            </label>
            <input
              type="range"
              id="fontSize"
              name="fontSize"
              min="12"
              max="32"
              step="1"
              value={settings.fontSize || 18}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Line Height */}
          <div>
            <label htmlFor="lineHeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Giãn dòng: {settings.lineHeight || 1.8}
            </label>
            <input
              type="range"
              id="lineHeight"
              name="lineHeight"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.lineHeight || 1.8}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          {/* Font Family */}
          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Font chữ
            </label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={settings.fontFamily || 'inherit'}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Background Color */}
           <div>
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Màu nền</p>
                <div className="flex space-x-2">
                    {['#FFFFFF', '#F3F4F6', '#FAF3E3', '#202020'].map(color => (
                        <button
                            key={color}
                            onClick={() => handleColorChange('backgroundColor', color)}
                            className={`w-8 h-8 rounded-full border-2 ${settings.backgroundColor === color ? 'ring-2 ring-offset-2 ring-sky-500' : 'border-gray-300 dark:border-gray-600'}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Nền ${color}`}
                        ></button>
                    ))}
                </div>
           </div>
           {/* Text Color */}
            <div className="mt-4">
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Màu chữ</p>
                <div className="flex space-x-2">
                    {['#000000', '#1F2937', '#4B5563', '#FFFFFF'].map(color => (
                        <button
                            key={color}
                            onClick={() => handleColorChange('textColor', color)}
                            className={`w-8 h-8 rounded-full border-2 ${settings.textColor === color ? 'ring-2 ring-offset-2 ring-sky-500' : 'border-gray-300 dark:border-gray-600'}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Chữ ${color}`}
                        ></button>
                    ))}
                </div>
            </div>



        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}