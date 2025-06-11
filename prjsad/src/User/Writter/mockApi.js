// === KHỞI TẠO DATABASE TRONG LOCALSTORAGE ===

// Hàm này giúp lấy dữ liệu từ localStorage, nếu chưa có thì tạo mới.
const getDb = () => {
    let db = JSON.parse(localStorage.getItem('fakeDb'));
    if (!db) {
        db = {
            stories: [],
            chapters: [],
            genres: [ // Giữ nguyên danh sách genres cố định
                { id: 3, name: 'Xuyên Sách' }, { id: 4, name: 'Trọng Sinh' },
                { id: 5, name: 'Xuyên Không' }, { id: 6, name: 'Hệ Thống' },
                { id: 7, name: 'Showbiz' }, { id: 8, name: 'Sảng Văn' },
                { id: 9, name: 'Ngược' }, { id: 10, name: 'Ngược Luyến Tàn Tâm' },
                { id: 11, name: 'Đọc Tâm' },
            ],
            // Thêm các counters để tự động tăng ID
            storyIdCounter: 1,
            chapterIdCounter: 1,
        };
        localStorage.setItem('fakeDb', JSON.stringify(db));
    }
    return db;
};

const saveDb = (db) => {
    localStorage.setItem('fakeDb', JSON.stringify(db));
};

const simulateNetwork = (delay = 300) => new Promise(res => setTimeout(res, delay));


// === CÁC HÀM API GIẢ ===

/**
 * API Giả: Tạo truyện mới
 */
export const createStoryApi = async ({ storyData, token }) => {
    await simulateNetwork();
    if (!token) return { success: false, message: "Cần phải đăng nhập." };

    if (!storyData.coverUrl) {
        return { success: false, message: "Ảnh bìa là bắt buộc." };
    }

    const db = getDb();
    
    // TẠO ĐỐI TƯỢNG ĐỂ LƯU VÀO DB (KHÔNG CÓ ẢNH)
    const newStoryForDb = {
        id: db.storyIdCounter++,
        title: storyData.title,
        author: storyData.author,
        description: storyData.description,
        status: storyData.status,
        genres: storyData.genres,
        slug: storyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now(),
        // KHÔNG LƯU `coverUrl` vào đây
        createdAt: new Date().toISOString(),
    };

    db.stories.push(newStoryForDb);
    // Bây giờ saveDb sẽ không bị lỗi quota nữa vì không có chuỗi Base64
    saveDb(db);

    // TẠO ĐỐI TƯỢNG ĐỂ TRẢ VỀ CHO COMPONENT (CÓ ẢNH TẠM THỜI)
    // Component sẽ nhận được URL ảnh để điều hướng và hiển thị ngay
    const responseData = {
        ...newStoryForDb,
        coverUrl: storyData.coverUrl // Thêm lại coverUrl vào dữ liệu trả về
    };

    console.log("FAKE_API: Story saved to DB (without image data):", newStoryForDb);
    return { success: true, message: "Đăng truyện thành công!", data: responseData };
};
/**
 * API Giả: Lấy thông tin truyện để quản lý
 */
export const getStoryForManagementApi = async ({ storySlug, token }) => {
    await simulateNetwork();
    if (!token) return { data: null };
    
    const db = getDb();
    const story = db.stories.find(s => s.slug === storySlug);
    if (!story) return { data: null };

    // VÌ `coverUrl` không được lưu, nó sẽ là `undefined` ở đây.
    // Chúng ta có thể thêm một ảnh placeholder để hiển thị.
    const storyWithPlaceholderImage = {
        ...story,
        // Nếu không có coverUrl, dùng ảnh mặc định
        coverUrl: story.coverUrl || 'https://via.placeholder.com/300x400.png?text=Preview+Not+Saved'
    };

    const storyChapters = db.chapters.filter(c => c.storyId === story.id);
    
    console.log("FAKE_API: Fetched story for management:", storyWithPlaceholderImage);
    return { data: { ...storyWithPlaceholderImage, chapters: storyChapters } };
};


/**
 * API Giả: Tạo chương mới
 */
export const createChapterApi = async ({ storyId, chapterData, token }) => {
    await simulateNetwork();
    if (!token) return { success: false, message: "Cần phải đăng nhập." };

    const db = getDb();
    const newChapter = {
        id: db.chapterIdCounter++,
        storyId: storyId,
        title: chapterData.title,
        content: chapterData.content,
        publishedAt: new Date().toISOString().split('T')[0],
    };

    db.chapters.push(newChapter);
    saveDb(db);

    console.log("FAKE_API: Chapter created:", newChapter);
    return { success: true, message: "Đăng chương mới thành công!" };
};


export const getChapterForEditApi = async ({ chapterId, token }) => {
    await simulateNetwork();
    if (!token) return { data: null };

    const db = getDb();
    const chapter = db.chapters.find(c => c.id === parseInt(chapterId));

    console.log("FAKE_API: Fetched chapter for edit:", chapter);
    return { data: chapter };
};

export const updateChapterApi = async ({ chapterId, chapterData, token }) => {
    await simulateNetwork();
    if (!token) return { success: false, message: "Cần phải đăng nhập." };

    const db = getDb();
    const chapterIndex = db.chapters.findIndex(c => c.id === parseInt(chapterId));
    if (chapterIndex === -1) return { success: false, message: "Không tìm thấy chương." };

    db.chapters[chapterIndex] = { ...db.chapters[chapterIndex], ...chapterData };
    saveDb(db);

    console.log("FAKE_API: Chapter updated:", db.chapters[chapterIndex]);
    return { success: true, message: "Cập nhật chương thành công!" };
};