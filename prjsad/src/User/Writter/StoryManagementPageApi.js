const MOCK_MANAGEMENT_STORY = {
    id: 123,
    title: 'Tôi Vô Tình Trở Thành Bố Của Nữ Chính',
    slug: 'bo-cua-nu-chinh',
    chapters: [
        { id: 1, title: 'Chương 1: Xuyên không rồi?', publishedAt: '2023-10-26' },
        { id: 2, title: 'Chương 2: Hệ thống xuất hiện', publishedAt: '2023-10-27' },
        { id: 3, title: 'Chương 3: Gặp gỡ nữ chính', publishedAt: '2023-10-28' },
    ]
};

/**
 * Lấy thông tin chi tiết của một truyện để quản lý
 * @param {object} params - Gồm { storySlug, token }
 */
export const getStoryForManagementApi = async ({ storySlug, token }) => {
    if (!token) return Promise.reject("Yêu cầu xác thực.");
    console.log(`API: Fetching management data for story: ${storySlug}`);
    return mockApiCall({ data: MOCK_MANAGEMENT_STORY });
};