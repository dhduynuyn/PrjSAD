
const mockApiCall = (data) => new Promise(resolve => setTimeout(() => resolve(data), 500));

const MOCK_DATA = {
    bookmarks: [
        { id: 2001, story: { id: 10, title: 'Bí Kíp Luyện Rồng Ở Thế Giới Tu Tiên', slug: 'bi-kip-luyen-rong', coverImage: 'https://i.pinimg.com/564x/2b/b8/2c/2bb82c6861d123682974b8801e14a1a7.jpg', latestChapter: 'Chương 150', views: 15200, bookmarks: 1200, status: 'IN_PROGRESS' } },
        { id: 2002, story: { id: 11, title: 'Tôi Vô Tình Trở Thành Bố Của Nữ Chính', slug: 'bo-cua-nu-chinh', coverImage: 'https://i.pinimg.com/564x/a7/70/b1/a770b134950663a838332152a4205562.jpg', latestChapter: 'Chương 99 (Hoàn)', views: 88000, bookmarks: 9500, status: 'COMPLETED' } },
        { id: 2003, story: { id: 12, title: 'Hệ Thống Bắt Tôi Phải Làm Việc Tốt', slug: 'he-thong-lam-viec-tot', coverImage: 'https://i.pinimg.com/564x/1a/ed/dd/1aeddd876a3f0190361e6c3817a224f4.jpg', latestChapter: 'Chương 45', views: 5400, bookmarks: 800, status: 'IN_PROGRESS' } },
        { id: 2004, story: { id: 13, title: 'Bạn Cùng Bàn Của Tôi Là Ma Cà Rồng', slug: 'ban-cung-ban-ma-ca-rong', coverImage: 'https://i.pinimg.com/564x/4d/e8/3c/4de83c66d1235942c74d812d8a5704a2.jpg', latestChapter: 'Chương 210', views: 21300, bookmarks: 2500, status: 'IN_PROGRESS' } },
        { id: 2005, story: { id: 14, title: 'Sau Khi Ly Hôn, Tôi Trở Thành Tỷ Phú', slug: 'ly-hon-thanh-ty-phu', coverImage: 'https://i.pinimg.com/564x/d1/15/4a/d1154a8a5f8b809d3b435252875b1c7b.jpg', latestChapter: 'Chương 888 (Hoàn)', views: 999000, bookmarks: 15000, status: 'COMPLETED' } },
    ]
};

const fetchBookmarks = async (userId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token không tồn tại');
  }

  try {
    const response = await fetch(`http://localhost:5000/users/follow_story`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu bookmarks');
    }

    const data = await response.json();
    
    const transformedData = (data || []).map(story => ({
      ...story,
      coverImage: (story.image_data)  // đổi tên
    }));

    console.log('Dữ liệu truyện đã lưu:', transformedData);

    return transformedData || [];
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return [];
  }
};


// Hàm kiểm tra token (tất cả API cần xác thực đều phải gọi)
const checkAuth = (token) => {
    if (!token) {
        // Trong thực tế, server sẽ trả về lỗi 401 Unauthorized
        return Promise.reject({ status: 401, message: "Yêu cầu xác thực. Vui lòng đăng nhập lại." });
    }
    return Promise.resolve();
}


// ===============================
// === API CHO TRUYỆN ĐÃ LƯU ===
// ===============================

/**
 * Lấy danh sách truyện đã lưu (Bookmarks) của người dùng hiện tại.
 * @param {object} params - Gồm { token, page }
 * @returns {Promise<object>} - Một object chứa { data, meta }
 *   - data: Mảng các item truyện đã lưu.
 *   - meta: Thông tin phân trang (trang hiện tại, trang cuối, tổng số item).
 */
export const getBookmarksApi = async ({ token, userId, page = 1 }) => {
  await checkAuth(token);
  console.log(`API: Lấy danh sách truyện đã lưu - Trang ${page}`);

  const allBookmarks = await fetchBookmarks(userId);

  const itemsPerPage = 10;
  const paginatedData = allBookmarks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return {
    data: paginatedData,
    meta: {
      currentPage: page,
      lastPage: Math.ceil(allBookmarks.length / itemsPerPage),
      totalItems: allBookmarks.length,
    },
  };
};

/**
 * Xóa một truyện khỏi danh sách đã lưu.
 * @param {object} params - Gồm { token, itemId }
 *   - itemId: ID của bản ghi bookmark cần xóa (không phải ID của truyện).
 * @returns {Promise<object>} - Một object chứa { success, message }
 */
export const deleteBookmarkApi = async ({ token, itemId }) => {
    await checkAuth(token);
    console.log(`API: Xóa bookmark có ID: ${itemId}`);

    // ----- Logic giả lập việc xóa trên server -----
    const index = MOCK_DATA.bookmarks.findIndex(item => item.id === itemId);
    if (index > -1) {
        MOCK_DATA.bookmarks.splice(index, 1);
        console.log("=> Xóa thành công trong MOCK_DATA.");
    } else {
        console.warn("=> Không tìm thấy item để xóa trong MOCK_DATA.");
    }
    // --------------------------------------------

    // API thật sẽ trả về thông báo thành công hoặc thất bại.
    return mockApiCall({ success: true, message: "Hủy lưu truyện thành công." });
};


// =============================================
// === API MỚI CHO VIỆC ĐĂNG VÀ QUẢN LÝ TRUYỆN ===
// =============================================

/**
 * Gửi dữ liệu truyện mới lên server để tạo.
 * Đây là hành động của user, nên đặt ở userApi.
 * @param {object} params - Gồm { storyData, token }
 *   - storyData: Dữ liệu từ form, bao gồm cả file ảnh
 */
export const createStoryApi = async ({ storyData, token }) => {
    console.log("USER_API: Creating new story...");
    
    const formData = new FormData();
    formData.append('title', storyData.title);
    formData.append('author', storyData.author);
    formData.append('description', storyData.description);
    formData.append('status', storyData.status);
    formData.append('genres', JSON.stringify(storyData.genres));
    if (storyData.coverImageFile) {
        formData.append('coverImage', storyData.coverImageFile);
    }

    const res = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    
    // Xử lý lỗi từ server
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đăng truyện thất bại');
    }

    return res.json();
};

/**
 * Lấy thông tin chi tiết một truyện mà user sở hữu để quản lý.
 * @param {object} params - Gồm { storySlug, token }
 */
export const getStoryForManagementApi = async ({ storySlug, token }) => {
    console.log(`USER_API: Fetching management data for story: ${storySlug}`);
    const res = await fetch(`${API_BASE_URL}/manage/stories/${storySlug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
        throw new Error('Không thể tải dữ liệu quản lý truyện');
    }
    return res.json();
};

/**
 * Tạo một chương mới cho truyện.
 * @param {object} params - Gồm { storyId, chapterData, token }
 */
export const createChapterApi = async ({ storyId, chapterData, token }) => {
    console.log(`USER_API: Creating new chapter for story ID ${storyId}`);
    const res = await fetch(`${API_BASE_URL}/stories/${storyId}/chapters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(chapterData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Tạo chương thất bại');
    }
    return res.json();
};

/**
 * Lấy nội dung của một chương để chỉnh sửa.
 * @param {object} params - Gồm { chapterId, token }
 */
export const getChapterForEditApi = async ({ chapterId, token }) => {
    console.log(`USER_API: Fetching chapter content for ID: ${chapterId}`);
    const res = await fetch(`${API_BASE_URL}/chapters/${chapterId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
        throw new Error('Không thể tải nội dung chương');
    }
    return res.json();
};

/**
 * Cập nhật nội dung của một chương đã có.
 * @param {object} params - Gồm { chapterId, chapterData, token }
 */
export const updateChapterApi = async ({ chapterId, chapterData, token }) => {
    console.log(`USER_API: Updating chapter ID: ${chapterId}`);
    const res = await fetch(`${API_BASE_URL}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(chapterData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Cập nhật chương thất bại');
    }
    return res.json();
};


/**
 * Lấy thông tin hồ sơ người dùng từ backend.
 * @param {object} params - Gồm { token }
 * @returns {Promise<object>} - Một object chứa { success, data | message }
 */
export const getUserProfileApi = async ({ token }) => {
    await checkAuth(token);

    try {
        const res = await fetch(`http://localhost:5000/users/info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Lỗi khi gọi /users/info:', data);
            return { success: false, message: data.error || 'Không thể lấy thông tin người dùng' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Lỗi kết nối khi gọi /users/info:', error);
        return { success: false, message: error.message };
    }
};

