
// Hàm giả lập API, thay thế bằng API thật của bạn
const mockApiCall = (data) => new Promise(resolve => setTimeout(() => resolve(data), 500));

// Dữ liệu giả
const MOCK_DATA = {
    bookmarks: [
        { id: 2001, story: { id: 10, title: 'Bí Kíp Luyện Rồng Ở Thế Giới Tu Tiên', slug: 'bi-kip-luyen-rong', coverImage: 'https://i.pinimg.com/564x/2b/b8/2c/2bb82c6861d123682974b8801e14a1a7.jpg', latestChapter: 'Chương 150', views: 15200, bookmarks: 1200, status: 'IN_PROGRESS' } },
        { id: 2002, story: { id: 11, title: 'Tôi Vô Tình Trở Thành Bố Của Nữ Chính', slug: 'bo-cua-nu-chinh', coverImage: 'https://i.pinimg.com/564x/a7/70/b1/a770b134950663a838332152a4205562.jpg', latestChapter: 'Chương 99 (Hoàn)', views: 88000, bookmarks: 9500, status: 'COMPLETED' } },
        { id: 2003, story: { id: 12, title: 'Hệ Thống Bắt Tôi Phải Làm Việc Tốt', slug: 'he-thong-lam-viec-tot', coverImage: 'https://i.pinimg.com/564x/1a/ed/dd/1aeddd876a3f0190361e6c3817a224f4.jpg', latestChapter: 'Chương 45', views: 5400, bookmarks: 800, status: 'IN_PROGRESS' } },
        { id: 2004, story: { id: 13, title: 'Bạn Cùng Bàn Của Tôi Là Ma Cà Rồng', slug: 'ban-cung-ban-ma-ca-rong', coverImage: 'https://i.pinimg.com/564x/4d/e8/3c/4de83c66d1235942c74d812d8a5704a2.jpg', latestChapter: 'Chương 210', views: 21300, bookmarks: 2500, status: 'IN_PROGRESS' } },
        { id: 2005, story: { id: 14, title: 'Sau Khi Ly Hôn, Tôi Trở Thành Tỷ Phú', slug: 'ly-hon-thanh-ty-phu', coverImage: 'https://i.pinimg.com/564x/d1/15/4a/d1154a8a5f8b809d3b435252875b1c7b.jpg', latestChapter: 'Chương 888 (Hoàn)', views: 999000, bookmarks: 15000, status: 'COMPLETED' } },
    ]
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
export const getBookmarksApi = async ({ token, page = 1 }) => {
    await checkAuth(token);
    console.log(`API: Lấy danh sách truyện đã lưu - Trang ${page}`);

    // ----- Logic giả lập phân trang -----
    const itemsPerPage = 20; // Số item trên mỗi trang
    const paginatedData = MOCK_DATA.bookmarks.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    // -------------------------------------

    // API thật sẽ trả về cấu trúc tương tự như thế này.
    return mockApiCall({
        data: paginatedData,
        meta: {
            currentPage: page,
            lastPage: Math.ceil(MOCK_DATA.bookmarks.length / itemsPerPage),
            totalItems: MOCK_DATA.bookmarks.length,
        },
    });
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