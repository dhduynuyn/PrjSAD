// UserProfilePage.js (Phiên bản cuối cùng)

import React, { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiLoader, FiCamera, FiUser, FiEdit2, FiSave, FiXCircle } from 'react-icons/fi';

// SỬA ĐỔI: Chỉ cần import useAuth
import { useAuth } from '../../AuthContext';

// XÓA BỎ: Không cần các API call này nữa vì dữ liệu đã có trong context
// import { getUserProfileApi, updateUserProfileApi } from '../../userApi';

// const API_BASE_URL = 'http://localhost:5000'; // Không cần nếu avatar đã là full URL từ context

export default function UserProfilePage() {
    // SỬA ĐỔI: Lấy trực tiếp `user` (đặt tên là profile cho tiện) và `updateUser` từ context
    const { isAuthenticated, user: profile, isLoadingAuth, updateUser } = useAuth();

    // XÓA BỎ: Các state này không còn cần thiết vì dữ liệu được quản lý bởi AuthContext
    // const [profile, setProfile] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // SỬA ĐỔI: Khởi tạo formData với giá trị mặc định trống để tránh lỗi nếu profile ban đầu là null
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const fileInputRef = useRef(null);

    // SỬA ĐỔI: Dùng useEffect để đồng bộ form khi `profile` từ context có dữ liệu hoặc thay đổi
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                username: profile.username || '',
                // Giả sử dữ liệu profile có thuộc tính 'bio'
                bio: profile.bio || '',
            });
            setAvatarPreview(profile.avatar || '');
        }
    }, [profile]); // Chạy lại mỗi khi object `profile` thay đổi

    // XÓA BỎ: useEffect để fetchProfile không còn cần thiết
    /*
    useEffect(() => {
        if (isAuthenticated) {
            const fetchProfile = async () => { ... };
            fetchProfile();
        }
    }, [isAuthenticated, token]);
    */

    // GIỮ NGUYÊN: Logic xử lý input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // GIỮ NGUYÊN: Logic xử lý thay đổi avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // GIỮ NGUYÊN: Logic hủy chỉnh sửa
    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form về lại dữ liệu gốc từ `profile` trong context
        if (profile) {
            setFormData({
                name: profile.name || '',
                username: profile.username || '',
                bio: profile.bio || '',
            });
            setAvatarPreview(profile.avatar || '');
        }
        setAvatarFile(null);
        setError('');
        setSuccess('');
    };
    
    // SỬA ĐỔI: handleSubmit sẽ gọi hàm `updateUser` từ context
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        // Giả lập việc gọi API và nhận về dữ liệu mới
        // Trong thực tế bạn sẽ gọi một API update thật, ví dụ:
        // const response = await updateUserProfileApi({ userData: submissionData, token });
        await new Promise(res => setTimeout(res, 1000)); // Giả lập độ trễ mạng

        // Dữ liệu mới để cập nhật context
        const updatedData = {
            ...formData, // Lấy name, bio đã sửa
            avatar: avatarPreview, // Lấy ảnh preview mới
        };
        const response = { success: true, message: "Cập nhật thông tin thành công!", data: updatedData };

        if (response.success) {
            setSuccess(response.message);
            // SỬA ĐỔI: Gọi hàm updateUser của context để cập nhật trạng thái toàn cục
            updateUser({
                ...profile, // Giữ lại các thông tin không đổi (id, email, stories...)
                ...response.data, // Ghi đè các thông tin đã thay đổi (name, bio, avatar)
            }); 
            
            setAvatarFile(null);
            setIsEditing(false);
        } else {
            setError(response.message);
        }
        setIsSubmitting(false);
    };

    // SỬA ĐỔI: Phần xử lý Loading và Xác thực giờ đơn giản hơn
    if (isLoadingAuth) {
        return <div className="flex justify-center items-center min-h-[70vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Kiểm tra nếu profile chưa kịp tải xong (trường hợp hiếm)
    if (!profile) {
        return <div className="text-center py-20 text-red-500">{error || 'Không thể tải thông tin người dùng.'}</div>;
    }

    // JSX GIỮ NGUYÊN logic, chỉ cần đảm bảo các thuộc tính (ví dụ `profile.bio`, `profile.stories`)
    // khớp với cấu trúc dữ liệu trong AuthContext của bạn.
    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 mb-8">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"/>
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                                        <FiUser className="text-5xl text-gray-400" />
                                    </div>
                                )}
                                {isEditing && (
                                    <>
                                        <button 
                                          type="button" 
                                          onClick={() => fileInputRef.current.click()}
                                          className="absolute bottom-1 right-1 bg-sky-600 text-white p-2 rounded-full hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                          aria-label="Thay đổi ảnh đại diện"
                                        >
                                            <FiCamera className="h-5 w-5"/>
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden"/>
                                    </>
                                )}
                            </div>
                            
                            {/* Thông tin chính */}
                            <div className="flex-grow text-center md:text-left">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-2xl font-bold w-full p-2 rounded bg-gray-100 dark:bg-gray-700" placeholder="Tên hiển thị"/>
                                        <p className="text-lg text-gray-500 w-full p-2 rounded bg-gray-100 dark:bg-gray-700">@{profile.username} (Không thể thay đổi)</p>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
                                        <p className="text-lg text-gray-500 dark:text-gray-400">@{profile.username}</p>
                                    </>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Email: {profile.gmail} (Không thể thay đổi)</p>
                                <div className="mt-4 flex justify-center md:justify-start gap-6 text-gray-600 dark:text-gray-300">
                                    {/* SỬA ĐỔI: Dùng profile.stories từ context */}
                                    <span><strong className="text-gray-800 dark:text-white">{profile.stories?.length || 0}</strong> Truyện đã đăng</span>
                                    <span><strong className="text-gray-800 dark:text-white">{profile.follows || 0}</strong> Người theo dõi</span>
                                </div>
                            </div>
                            
                            {/* Nút Chỉnh sửa / Lưu */}
                            <div className="flex-shrink-0 mt-4 md:mt-0">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
                                            {isSubmitting ? <FiLoader className="animate-spin"/> : <FiSave />} Lưu
                                        </button>
                                        <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                                            <FiXCircle /> Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
                                        <FiEdit2 /> Chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tiểu sử */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Tiểu sử</h2>
                            {isEditing ? (
                                <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" placeholder="Giới thiệu về bản thân..."></textarea>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{profile.bio || "Chưa có tiểu sử."}</p>
                            )}
                        </div>
                        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
                    </form>
                </div>

                {/* Danh sách truyện đã đăng */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Truyện Đã Đăng</h2>
                    {/* SỬA ĐỔI: Lặp qua `profile.stories` từ context */}
                    {profile.stories && profile.stories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.stories.map(story => (
                                <Link to={`/user/quan-ly-truyen/${story.slug}`} key={story.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">{story.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trạng thái: {story.status}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <FiUser className="mx-auto text-4xl text-gray-400"/>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Bạn chưa đăng truyện nào.</p>
                            <Link to="/user/dang-truyen" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
                                Đăng truyện ngay
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}