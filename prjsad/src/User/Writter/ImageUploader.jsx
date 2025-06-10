import React, { useState } from 'react';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

export default function ImageUploader({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onFileSelect(file); 
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onFileSelect(null); 
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Ảnh bìa
      </label>
      <div className="mt-1 flex justify-center items-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative">
        {preview ? (
          <>
            <img src={preview} alt="Xem trước" className="h-full w-full object-contain rounded-md" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <FiTrash2 />
            </button>
          </>
        ) : (
          <div className="space-y-1 text-center">
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none"
              >
                <span>Tải ảnh lên</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">hoặc kéo và thả</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF tối đa 2MB</p>
          </div>
        )}
      </div>
    </div>
  );
}