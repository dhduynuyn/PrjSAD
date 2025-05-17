// --- Dữ liệu giả lập cho Genres và Tags ---
const MOCK_GENRES = [
  { id: 6, label: 'Xuyên Sách' },
  { id: 7, label: 'Trọng Sinh' },
  { id: 8, label: 'Xuyên Không' },
  { id: 9, label: 'Hệ Thống' },
  { id: 10, label: 'Showbiz' },
  { id: 11, label: 'Sảng Văn' },
  { id: 12, label: 'Ngược' },
  { id: 13, label: 'Ngược Luyến Tàn Tâm' },
  { id: 14, label: 'Đọc Tâm' },
];

const MOCK_TAGS = [
  { id: 'he-thong', name: 'Hệ Thống', count: 123 },
  { id: 'cung-dau', name: 'Cung Đấu', count: 88 },
  { id: 'nu-cuong', name: 'Nữ Cường', count: 210 },
  { id: 'sung', name: 'Sủng', count: 190 },
  { id: 'nguoc', name: 'Ngược', count: 70 },
  { id: '1v1', name: '1v1', count: 350 },
  { id: 'he', name: 'HE', count: 400 },
  { id: 'se', name: 'SE', count: 30 },
  { id: 'xuyen-thu', name: 'Xuyên thư', count: 95 },
  { id: 'mat-the', name: 'Mạt thế', count: 60 },
  { id: 'di-nang', name: 'Dị năng', count: 110 },
  { id: 'manh-bao', name: 'Manh bảo', count: 75 },
];

export const getGenresApi = async () => {
  console.log("API Call (Mocked): getGenresApi");
  return new Promise(resolve => setTimeout(() => resolve(MOCK_GENRES), 200));
};

export const getTagsApi = async () => {
  console.log("API Call (Mocked): getTagsApi");
  return new Promise(resolve => setTimeout(() => resolve(MOCK_TAGS), 250));
};

// --- MOVE THESE CONSTANTS UP ---
const STATUS_OPTIONS = [
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'ongoing', label: 'Còn tiếp' },
  { id: 'paused', label: 'Tạm ngưng' },
];
const OFFICIAL_OPTIONS = [
  { id: 'original', label: 'Nguyên sang' },
  { id: 'derivative', label: 'Diễn sinh' },
];
const GENDER_TARGET_OPTIONS = [
  { id: 'ngon-tinh', label: 'Ngôn tình' },
  { id: 'nam-sinh', label: 'Nam sinh' },
  { id: 'dam-my', label: 'Đam mỹ' },
  { id: 'bach-hop', label: 'Bách hợp' },
];
const AGE_OPTIONS = [
  { id: 'co-dai', label: 'Cổ đại' },
  { id: 'can-dai', label: 'Cận đại' },
  { id: 'hien-dai', label: 'Hiện đại' },
  { id: 'tuong-lai', label: 'Tương lai' },
];
const ENDING_OPTIONS = [
  { id: 'he', label: 'HE' },
  { id: 'se', label: 'SE' },
  { id: 'oe', label: 'OE' },
];

// --- Hàm giả lập cho tìm kiếm nâng cao ---
const ALL_MOCK_STORIES = Array.from({ length: 100 }, (_, i) => {
    const genresForStory = MOCK_GENRES.filter(() => Math.random() > 0.7).slice(0, 3); // Ngẫu nhiên 0-3 thể loại
    const tagsForStory = MOCK_TAGS.filter(() => Math.random() > 0.6).slice(0, 4); // Ngẫu nhiên 0-4 tags

    return {
        id: `story-id-${i + 1}`,
        slug: `truyen-gia-lap-${i + 1}`,
        title: `Truyện Giả Lập Số ${i + 1} ${genresForStory.length > 0 ? `(${genresForStory[0].name})` : ''}`,
        coverUrl: `https://picsum.photos/seed/story${i + 1}/200/260`,
        views: Math.floor(Math.random() * 10000) + 100,
        bookmarks: Math.floor(Math.random() * 500) + 10,
        latestChapter: { name: `Chương ${Math.floor(Math.random() * 100) + 50}` },
        // Thêm các thuộc tính để filter
        status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)].id,
        officialType: OFFICIAL_OPTIONS[Math.floor(Math.random() * OFFICIAL_OPTIONS.length)].id,
        genderTarget: GENDER_TARGET_OPTIONS[Math.floor(Math.random() * GENDER_TARGET_OPTIONS.length)].id,
        age: AGE_OPTIONS[Math.floor(Math.random() * AGE_OPTIONS.length)].id,
        ending: ENDING_OPTIONS[Math.floor(Math.random() * ENDING_OPTIONS.length)].id,
        genres: genresForStory.map(g => g.id), // Lưu ID của genre
        tags: tagsForStory.map(t => t.id),     // Lưu ID của tag
        totalChaptersNum: Math.floor(Math.random() * 1500) + 10, // Số chương ngẫu nhiên
        author: { name: `Tác Giả ${String.fromCharCode(65 + (i % 26))}` }
    };
});


// Số lượng truyện mỗi trang
const ITEMS_PER_PAGE = 12;


export const searchStoriesAdvancedApi = async (params) => {
  console.log("API Call (Mocked): searchStoriesAdvancedApi with params", params);

  return new Promise(resolve => setTimeout(() => {
    let filteredStories = [...ALL_MOCK_STORIES];

    // 1. Lọc theo keyword (tên truyện hoặc tác giả)
    if (params.q) {
      const keywordLower = params.q.toLowerCase();
      filteredStories = filteredStories.filter(story =>
        story.title.toLowerCase().includes(keywordLower) ||
        story.author.name.toLowerCase().includes(keywordLower)
      );
    }

    // 2. Lọc theo status (Tình trạng)
    if (params.status && params.status.length > 0) {
      filteredStories = filteredStories.filter(story => params.status.includes(story.status));
    }

    // 3. Lọc theo officialType (Tính chất)
    if (params.official && params.official.length > 0) {
      filteredStories = filteredStories.filter(story => params.official.includes(story.officialType));
    }

    // 4. Lọc theo genderTarget (Loại truyện)
    if (params.genderTarget && params.genderTarget.length > 0) {
      filteredStories = filteredStories.filter(story => params.genderTarget.includes(story.genderTarget));
    }

    // 5. Lọc theo age (Thời đại)
    if (params.age && params.age.length > 0) {
      filteredStories = filteredStories.filter(story => params.age.includes(story.age));
    }

    // 6. Lọc theo ending (Kết thúc)
    if (params.ending && params.ending.length > 0) {
      filteredStories = filteredStories.filter(story => params.ending.includes(story.ending));
    }

    // 7. Lọc theo genres (Thể loại - truyện phải chứa TẤT CẢ các genre đã chọn)
    if (params.genres && params.genres.length > 0) {
      filteredStories = filteredStories.filter(story =>
        params.genres.every(genreId => story.genres.includes(genreId))
      );
    }

    // 8. Lọc theo tags (bao gồm - truyện phải chứa TẤT CẢ các tag đã chọn)
    if (params.tags && params.tags.length > 0) {
      filteredStories = filteredStories.filter(story =>
        params.tags.every(tagId => story.tags.includes(tagId))
      );
    }

    // 9. Lọc theo excludedTags (loại trừ - truyện KHÔNG ĐƯỢC chứa BẤT KỲ tag nào đã chọn)
    if (params.excludedTags && params.excludedTags.length > 0) {
      filteredStories = filteredStories.filter(story =>
        !params.excludedTags.some(tagId => story.tags.includes(tagId))
      );
    }

    // 10. Lọc theo totalChapters (Độ dài)
    if (params.tc) {
        const tcValue = parseInt(params.tc);
        filteredStories = filteredStories.filter(story => {
            switch(tcValue) {
                case 1: return story.totalChaptersNum >= 1 && story.totalChaptersNum <= 20;
                case 2: return story.totalChaptersNum >= 21 && story.totalChaptersNum <= 50;
                case 3: return story.totalChaptersNum >= 51 && story.totalChaptersNum <= 100;
                case 4: return story.totalChaptersNum >= 101 && story.totalChaptersNum <= 200;
                case 5: return story.totalChaptersNum >= 201 && story.totalChaptersNum <= 300;
                case 6: return story.totalChaptersNum >= 301 && story.totalChaptersNum <= 500;
                case 7: return story.totalChaptersNum >= 501 && story.totalChaptersNum <= 1000;
                case 8: return story.totalChaptersNum > 1000;
                default: return true;
            }
        });
    }

    // Phân trang
    const page = parseInt(params.page || '1');
    const totalItems = filteredStories.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStories = filteredStories.slice(startIndex, endIndex);

    resolve({
      data: paginatedStories,
      meta: {
        currentPage: page,
        lastPage: totalPages,
        totalItems: totalItems,
        perPage: ITEMS_PER_PAGE
      }
    });
  }, 800)); // Giả lập độ trễ mạng
};