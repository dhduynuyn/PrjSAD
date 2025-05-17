// --- Dữ liệu giả lập cho Genres và Tags ---
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

export const getGenresApi = async () => {
  console.log("API Call (Mocked): getGenresApi");
  return new Promise(resolve => setTimeout(() => resolve(MOCK_GENRES), 200));
};

let MOCK_TAGS = [];

export const getTagsApi = async () => {
  try {
    const response = await fetch('http://localhost:5000/stories/tags');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    MOCK_TAGS = data; // Gán vào biến toàn cục
    return MOCK_TAGS;
  } catch (error) {
    console.error("Lỗi khi gọi API getTagsApi:", error);
    return MOCK_TAGS; // Trả về cái hiện có (có thể rỗng)
  }
};

// Cho phép module khác truy cập MOCK_TAGS nếu cần
export { MOCK_TAGS };

// --- MOVE THESE CONSTANTS UP ---
const STATUS_OPTIONS = [
  { id: 28, label: 'Đã đủ bộ' },
  { id: 35, label: 'Đang phát hành' },
  { id: 36, label: 'Tạm ngưng' },
];

const OFFICIAL_OPTIONS = [
  { id: 1, label: 'Nguyên sang' },
  { id: 2, label: 'Diễn sinh' },

];

const GENDER_TARGET_OPTIONS = [
  { id: 12, label: 'Ngôn Tình' },
  { id: 13, label: 'Đam Mỹ' },
  { id: 14, label: 'Bách Hợp' },
  { id: 15, label: 'Nam sinh' },
  { id: 16, label: 'Không CP' },
];

const AGE_OPTIONS = [
  { id: 17, label: 'Cổ Đại' },
  { id: 18, label: 'Cận Đại' },
  { id: 19, label: 'Hiện Đại' },
  { id: 20, label: 'Tương Lai' },
  { id: 21, label: 'Niên Đại' },
];

const ENDING_OPTIONS = [
  { id: 22, label: 'HE' },
  { id: 23, label: 'SE' },
  { id: 24, label: 'OE' },
  { id: 25, label: 'BE' },
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
import axios from 'axios';

export const searchStoriesAdvancedApi = async (params) => {
  console.log("API Call (Updated): searchStoriesAdvancedApi with params", params);

  const CATEGORY_KEYS = [
    'status',
    'official',
    'genderTarget',
    'age',
    'ending',
    'genres',
    'tags',
    'excludedTags'
  ];

const filteredStories = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:5000/categories/${id}`, false); // false = đồng bộ
  try {
    xhr.send(null);
    if (xhr.status === 200) {
      const json = JSON.parse(xhr.responseText);
      // Nếu json là mảng, trả về luôn, nếu là object có property storyIds thì trả về property đó
      return Array.isArray(json) ? json : (json.storyIds || []);
    } else {
      console.error(`Error fetching category ${id}: status ${xhr.status}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return [];
  }
};

  const allCategoryStoryIdSets = [];

  // 1. Lặp qua từng key chứa ID
  for (const key of CATEGORY_KEYS) {
  const ids = params[key];
  if (ids && ids.length > 0) {
    const storyIdLists = ids.map(id => {
      return filteredStories(id);
    });
    const mergedIds = storyIdLists.reduce((acc, list) => acc.concat(list), []);
  
    if (key === 'excludedTags') {
      allCategoryStoryIdSets.push({ exclude: true, ids: new Set(mergedIds) });
    } else {
      allCategoryStoryIdSets.push({ exclude: false, ids: new Set(mergedIds) });
    }
  }
}

  console.log("All category story ID sets:", allCategoryStoryIdSets);

  // 2. Giao nhau các danh sách storyId
  let finalStoryIds = null;

  for (const entry of allCategoryStoryIdSets) {
    if (entry.exclude) continue; // Bỏ qua lúc này, sẽ xử lý sau

    if (finalStoryIds === null) {
      finalStoryIds = new Set(entry.ids);
    } else {
      finalStoryIds = new Set([...finalStoryIds].filter(id => entry.ids.has(id)));
    }

    console.log(`After processing ${entry.exclude ? 'excludedTags' : 'included tags'}:`, finalStoryIds);
  }

  if (!finalStoryIds) {
    finalStoryIds = new Set(); // Nếu không có filter nào => rỗng
  }

  // 3. Trừ excludedTags
  for (const entry of allCategoryStoryIdSets) {
    if (entry.exclude) {
      finalStoryIds = new Set([...finalStoryIds].filter(id => !entry.ids.has(id)));
    }
  }

  console.log("Final story IDs after filtering:", finalStoryIds);

  const fetchStoryByIdSync = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:5000/stories/${id}`, false); // false = đồng bộ
    try {
      xhr.send(null);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        return {
          id: data.id,
          slug: data.id,
          title: data.title,
          coverUrl: data.coverUrl || (data.image_data ? `data:image/jpeg;base64,${data.image_data}` : ''),
          views: data.views,
          bookmarks: data.followers,
          latestChapter: { name: data.latestChapter },
          // Thêm các thuộc tính để filter
          status: data.status,
          totalChaptersNum: data.chapters.length,
          author: { name: `Tác Giả ${data.author}` }
        };
      } else {
        console.error(`Error fetching story ${id}: status ${xhr.status}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      return null;
    }
  };

  const storyDetails = [];
  for (const id of finalStoryIds) {
    const story = fetchStoryByIdSync(id);
    if (story) storyDetails.push(story);
  }

  console.log("Fetched story details:", storyDetails);


  // // 5. Lọc theo keyword (tên truyện hoặc tác giả)
  // if (params.q) {
  //   const keywordLower = params.q.toLowerCase();
  //   filteredStories = filteredStories.filter(story =>
  //     story.title.toLowerCase().includes(keywordLower) ||
  //     story.author.name.toLowerCase().includes(keywordLower)
  //   );
  // }

  // // 6. Lọc theo độ dài truyện (tc)
  // if (params.tc) {
  //   const tcValue = parseInt(params.tc);
  //   filteredStories = filteredStories.filter(story => {
  //     switch(tcValue) {
  //       case 1: return story.totalChaptersNum >= 1 && story.totalChaptersNum <= 20;
  //       case 2: return story.totalChaptersNum >= 21 && story.totalChaptersNum <= 50;
  //       case 3: return story.totalChaptersNum >= 51 && story.totalChaptersNum <= 100;
  //       case 4: return story.totalChaptersNum >= 101 && story.totalChaptersNum <= 200;
  //       case 5: return story.totalChaptersNum >= 201 && story.totalChaptersNum <= 300;
  //       case 6: return story.totalChaptersNum >= 301 && story.totalChaptersNum <= 500;
  //       case 7: return story.totalChaptersNum >= 501 && story.totalChaptersNum <= 1000;
  //       case 8: return story.totalChaptersNum > 1000;
  //       default: return true;
  //     }
  //   });
  // }

    // Phân trang
    const page = parseInt(params.page || '1');
    const totalItems = storyDetails.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStories = storyDetails.slice(startIndex, endIndex);

  return {
    data: paginatedStories,
    meta: {
      currentPage: page,
      lastPage: totalPages,
      totalItems: totalItems,
      perPage: ITEMS_PER_PAGE
    }
  };
};
