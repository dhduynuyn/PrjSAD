const MOCK_GENRES = [
  { id: 3, label: 'Xuyên Sách' },
  { id: 4, label: 'Trọng Sinh' },
  { id: 5, label: 'Xuyên Không' },
  { id: 6, label: 'Hệ Thống' },
  { id: 7, label: 'Showbiz' },
  { id: 8, label: 'Sảng Văn' },
  { id: 9, label: 'Ngược' },
  { id: 10, label: 'Ngược Luyến Tàn Tâm' },
  { id: 11, label: 'Đọc Tâm' },
];

const STATUS_OPTIONS = [
  { id: 28, label: 'Đã đủ bộ' },
  { id: 35, label: 'Đang phát hành' },
  { id: 36, label: 'Tạm ngưng' },
];

const ALL_MOCK_STORIES = Array.from({ length: 150 }, (_, i) => {
    const genresForStory = MOCK_GENRES.filter(() => Math.random() > 0.8).slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 thể loại
    return {
        id: `story-id-${i + 1}`,
        slug: `truyen-gia-lap-${i + 1}`,
        title: `Truyện Giả Lập Số ${i + 1} ${genresForStory.length > 0 ? `(${genresForStory[0].name})` : ''}`,
        coverUrl: `https://picsum.photos/seed/story${i + 1}/200/260`,
        views: Math.floor(Math.random() * 10000) + 100,
        bookmarks: Math.floor(Math.random() * 500) + 10,
        latestChapter: { name: `Chương ${Math.floor(Math.random() * 100) + 50}`, slug: `chuong-${Math.floor(Math.random() * 100) + 50}` },
        status: STATUS_OPTIONS[i % STATUS_OPTIONS.length].id,
        genreSlug: genresForStory.length > 0 ? genresForStory[0].id : MOCK_GENRES[0].id, 
        genres: genresForStory.map(g => g.id), 
        updatedAtISO: new Date(Date.now() - (i * 1000 * 3600 * (Math.random() * 20 + 4) )).toISOString(), 
        totalChaptersNum: Math.floor(Math.random() * 1500) + 10,
        author: { name: `Tác Giả ${String.fromCharCode(65 + (i % 26))}` }
    };
});

const ITEMS_PER_PAGE_LIST = 24; // Hoặc bất kỳ giá trị nào bạn muốn

export const getStoriesApi = async (filters = {}) => {
  console.log("API Call (Mocked): getStoriesApi with filters", filters);

  return new Promise(resolve => setTimeout(() => {
    let filteredStories = [...ALL_MOCK_STORIES];

    // Lọc theo status (ví dụ: 'completed' cho truyện full)
    if (filters.status) { // <--- Sẽ khớp với { status: 'completed' }
      filteredStories = filteredStories.filter(story => story.status === filters.status);
    }

    // Sắp xếp (ví dụ: cho truyện mới)
    if (filters.orderBy === 'updatedAt' && filters.orderDirection === 'desc') { // <--- Sẽ khớp
      filteredStories.sort((a, b) => new Date(b.updatedAtISO) - new Date(a.updatedAtISO));
    }
    
    // Phân trang
    const page = parseInt(filters.page || '1');
    const totalItems = filteredStories.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_LIST);
    const startIndex = (page - 1) * ITEMS_PER_PAGE_LIST;
    const paginatedStories = filteredStories.slice(startIndex, startIndex + ITEMS_PER_PAGE_LIST);

    resolve({
      data: paginatedStories,
      meta: {
        currentPage: page,
        lastPage: totalPages,
        totalItems: totalItems,
      }
    });
  }, 700));
};