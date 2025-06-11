// === KHỞI TẠO DATABASE TRONG LOCALSTORAGE ===

// Hàm này giúp lấy dữ liệu từ localStorage, nếu chưa có thì tạo mới.
const getDb = () => {
    let db = JSON.parse(localStorage.getItem('fakeDb'));
    if (!db) {
        db = {
            stories: [],
            chapters: [],
            genres: [ 
                { id: 3, name: 'Xuyên Sách' }, { id: 4, name: 'Trọng Sinh' },
                { id: 5, name: 'Xuyên Không' }, { id: 6, name: 'Hệ Thống' },
                { id: 7, name: 'Showbiz' }, { id: 8, name: 'Sảng Văn' },
                { id: 9, name: 'Ngược' }, { id: 10, name: 'Ngược Luyến Tàn Tâm' },
                { id: 11, name: 'Đọc Tâm' },
            ],
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
    
    const newStoryForDb = {
        id: db.storyIdCounter++,
        title: storyData.title,
        author: storyData.author,
        description: storyData.description,
        status: storyData.status,
        genres: storyData.genres,
        slug: storyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now(),
        createdAt: new Date().toISOString(),
    };

    db.stories.push(newStoryForDb);
    saveDb(db);
    
    // Đảm bảo đối tượng trả về có chapters là một mảng rỗng
    const responseData = {
        ...newStoryForDb,
        coverUrl: storyData.coverUrl, // Thêm lại coverUrl vào dữ liệu trả về
        chapters: [] // Thêm thuộc tính này để nhất quán với getStoryForManagementApi
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
    const storyFromDb = db.stories.find(s => s.slug === storySlug);
    if (!storyFromDb) return { data: null };

    // Lấy các chương liên quan
    const storyChapters = db.chapters.filter(c => c.storyId === storyFromDb.id);
    
    // TẠO ĐỐI TƯỢNG TRẢ VỀ HOÀN CHỈNH
    const responseData = {
        ...storyFromDb, // Lấy tất cả thông tin đã lưu
        chapters: storyChapters, // Gán các chương đã tìm thấy

        // FIX: THÊM MỘT URL ẢNH PLACEHOLDER HỢP LỆ
        // Điều này đảm bảo component luôn nhận được `coverUrl` là một chuỗi URL
        coverUrl: `https://placehold.co/400x600/262626/FFFFFF?text=${encodeURIComponent(storyFromDb.title)}`
    };

    console.log("FAKE_API: Fetched story for management and added placeholder image:", responseData);
    return { data: responseData };
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