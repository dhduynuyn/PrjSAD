import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
//import { createStoryApi } from '../../userApi';
import { createStoryApi } from './mockApi';
import ImageUploader from './ImageUploader';
import { FiLoader } from 'react-icons/fi';

const GENRES_LIST = [
  { id: 3, name: 'Xuyên Sách' },
  { id: 4, name: 'Trọng Sinh' },
  { id: 5, name: 'Xuyên Không' },
  { id: 6, name: 'Hệ Thống' },
  { id: 7, name: 'Showbiz' },
  { id: 8, name: 'Sảng Văn' },
  { id: 9, name: 'Ngược' },
  { id: 10, name: 'Ngược Luyến Tàn Tâm' },
  { id: 11, name: 'Đọc Tâm' },
];

const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided"));
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


export default function CreateStoryPage() {
  const { isAuthenticated, token, isLoadingAuth, addStoryToUser } = useAuth();  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'IN_PROGRESS', // Mặc định là 'Đang ra'
    genres: [], // Danh sách ID các thể loại đã chọn
  });
  const [coverImageFile, setCoverImageFile] = useState(null); // State để lưu file ảnh
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    const genreId = parseInt(value);
    setFormData(prev => {
      if (checked) {
        return { ...prev, genres: [...prev.genres, genreId] };
      } else {
        return { ...prev, genres: prev.genres.filter(id => id !== genreId) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim() || !coverImageFile) {
      setError("Vui lòng điền đầy đủ Tên truyện, Giới thiệu và tải lên Ảnh bìa.");
      return;
    }
    if (formData.genres.length === 0) {
      setError("Vui lòng chọn ít nhất một thể loại.");
      return;
    }

    setIsSubmitting(true);
    
    // Tạo FormData để gửi đi (giữ nguyên logic này)
    // const submissionData = new FormData();
    // submissionData.append('title', formData.title);
    // submissionData.append('author', formData.author);
    // submissionData.append('description', formData.description);
    // submissionData.append('status', formData.status);
    // submissionData.append('coverImage', coverImageFile);
    // submissionData.append('genres', JSON.stringify(formData.genres));
    try {
        // Đọc file thành chuỗi base64 data URL
        const coverImageUrl = await readFileAsDataURL(coverImageFile);

        // THAY ĐỔI Ở ĐÂY:
        // Gửi chuỗi URL đã xử lý, không gửi đối tượng file nữa.
        // Đổi tên thuộc tính thành 'coverUrl' cho rõ nghĩa.
        const storyPayload = {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            status: formData.status,
            genres: formData.genres,
            coverUrl: coverImageUrl // <-- SỬA Ở ĐÂY
        };

        console.log("Dữ liệu gửi đến API:", storyPayload);

        // Gọi API với payload đã được chuẩn bị
        const response = await createStoryApi({ storyData: storyPayload, token });
        
        if (response.success) {
            const newStory = response.data; // Giả sử API trả về toàn bộ object truyện mới

            // 1. Cập nhật trạng thái global
            addStoryToUser(newStory); 

            // 2. Lấy slug của truyện mới
            const newStorySlug = newStory.slug;
            alert(response.message || "Tạo truyện thành công!");

            // 3. Kiểm tra xem có slug không và điều hướng
            if (newStory && newStory.slug) {
          // ==========================================================
          // THAY ĐỔI QUAN TRỌNG Ở ĐÂY
          // Truyền object `newStory` qua state của navigation
          // ==========================================================
          navigate(`/user/quan-ly-truyen/${newStory.slug}`, { 
            state: { story: newStory } 
          });
        } else {
          console.warn("API did not return a slug. Redirecting to profile.");
          navigate('/user/profile');
        }
      } else {
        setError(response.message || "Đã có lỗi xảy ra.");
      }
    } catch (err) {
      // ... error handling ...
    } finally {
      setIsSubmitting(false);
    }
  };
  // Xử lý xác thực
  if (isLoadingAuth) {
    return <div className="flex justify-center items-center min-h-[50vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Đăng Truyện Mới</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cột trái: Upload ảnh */}
              <div className="md:col-span-1">
                <ImageUploader onFileSelect={setCoverImageFile} />
              </div>
              
              {/* Cột phải: Thông tin truyện */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên truyện <span className="text-red-500">*</span></label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tác giả</label>
                  <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} placeholder="Để trống nếu là tác giả của bạn" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tình trạng</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="IN_PROGRESS">Đang ra</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="PAUSED">Tạm dừng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phần Thể loại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thể loại</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border p-4 rounded-md dark:border-gray-600">
                {GENRES_LIST.map(genre => (
                  <div key={genre.id} className="flex items-center">
                    <input id={`genre-${genre.id}`} name="genres" type="checkbox" value={genre.id} onChange={handleGenreChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                    <label htmlFor={`genre-${genre.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{genre.name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần Giới thiệu */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giới thiệu <span className="text-red-500">*</span></label>
              <textarea id="description" name="description" rows="6" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>

            {/* Nút Submit và thông báo lỗi */}
            <div>
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                    <>
                        <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Đang xử lý...
                    </>
                ) : (
                    'Đăng Truyện'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}