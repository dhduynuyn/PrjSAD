import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { getStoryForManagementApi } from '../../userApi';
import { FiPlusCircle, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

export default function StoryManagementPage() {
    const { storySlug } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStoryData = async () => {
            try {
                const response = await getStoryForManagementApi({ storySlug, token });
                setStory(response.data);
            } catch (err) {
                console.error("Failed to fetch story management data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStoryData();
    }, [storySlug, token]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><FiLoader className="animate-spin text-4xl text-sky-600" /></div>;
    }

    if (!story) {
        return <div className="text-center py-10">Không tìm thấy thông tin truyện hoặc bạn không có quyền truy cập.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{story.title}</h1>
                        <p className="text-sm text-gray-500">Quản lý truyện của bạn</p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <Link 
                            to={`/user/quan-ly-truyen/${story.slug}/them-chuong`}
                            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            <FiPlusCircle className="mr-2" /> Thêm chương
                        </Link>
                        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            <FiEdit className="mr-2" /> Sửa thông tin
                        </button>
                    </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Danh sách chương</h2>
                    <div className="space-y-3">
                        {story.chapters.length > 0 ? (
                            story.chapters.map(chapter => (
                                <div key={chapter.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                    <div>
                                        <p className="font-medium dark:text-gray-200">{chapter.title}</p>
                                        <p className="text-xs text-gray-500">Xuất bản: {chapter.publishedAt}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => navigate(`/user/quan-ly-truyen/${story.slug}/sua-chuong/${chapter.id}`)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">Chưa có chương nào được đăng.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}