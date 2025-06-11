import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
//import { createStoryApi, getChapterForEditApi, updateChapterApi } from '../../userApi';
import { createStoryApi, getChapterForEditApi, updateChapterApi } from './mockApi';
import { FiLoader } from 'react-icons/fi';

export default function ChapterCreateEditPage() {
    const { storySlug, chapterId } = useParams(); // chapterId sẽ có nếu là trang sửa
    const { token } = useAuth();
    const navigate = useNavigate();
    const isEditing = !!chapterId; // true nếu có chapterId, ngược lại là false

    const [formData, setFormData] = useState({ title: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditing); // Chỉ loading nếu là trang sửa

    useEffect(() => {
        if (isEditing) {
            const fetchChapterData = async () => {
                try {
                    const response = await getChapterForEditApi({ chapterId, token });
                    setFormData({
                        title: response.data.title,
                        content: response.data.content
                    });
                } catch (err) {
                    console.error("Failed to fetch chapter:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchChapterData();
        }
    }, [isEditing, chapterId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            alert("Vui lòng nhập đầy đủ tiêu đề và nội dung chương.");
            return;
        }

        setIsSubmitting(true);
        try {
            let response;
            if (isEditing) {
                response = await updateChapterApi({ chapterId, chapterData: formData, token });
            } else {
                response = await createChapterApi({ storySlug, chapterData: formData, token });
            }

            if (response.success) {
                alert(response.message);
                // Quay về trang quản lý truyện sau khi thành công
                navigate(`/user/quan-ly-truyen/${storySlug}`);
            }
        } catch (err) {
            console.error("Failed to submit chapter:", err);
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
                {isEditing ? `Sửa Chương` : 'Thêm Chương Mới'}
            </h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề chương</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung</label>
                    {/* THAY THẾ BẰNG RICH TEXT EDITOR Ở ĐÂY */}
                    <textarea id="content" name="content" rows="20" value={formData.content} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="flex items-center bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 disabled:bg-sky-400">
                        {isSubmitting && <FiLoader className="animate-spin mr-2" />}
                        {isEditing ? 'Lưu thay đổi' : 'Đăng chương'}
                    </button>
                </div>
            </form>
        </div>
    );
}