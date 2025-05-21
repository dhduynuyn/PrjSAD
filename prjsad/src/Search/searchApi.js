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


// Số lượng truyện mỗi trang
const ITEMS_PER_PAGE = 12;
import qs from 'qs';
import axios from 'axios';

// http://localhost:5173/search-results?status=28&age=17&page=1

export const searchStoriesAdvancedApi = async (params) => {
  console.log("API Call: searchStoriesAdvancedApi with params", params);
  let stories_filter = []
  try {
    // Loại bỏ giá trị rỗng null undefined hoặc mảng rỗng
    const cleanedParams = {};
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value) && value.length) {
        cleanedParams[key] = value;
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanedParams[key] = value;
      }
    }

    const { data: stories = [] } = await axios.get(
      `http://localhost:5000/stories/search`,
      {
        params: cleanedParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      }
    );

    // Convert data to expected frontend format if necessary
    stories_filter = stories.map(data => ({
      id: data.id,
      slug: data.id,
      title: data.title,
      coverUrl: data.coverUrl || (data.image_data ? `data:image/jpeg;base64,${data.image_data}` : 'https://picsum.photos/seed/story${data.id}/200/260'),
      views: data.views,
      bookmarks: data.followers,
      latestChapter: { name: data.latest_chapter },
      status: data.status,
      totalChaptersNum: data.chapters?.length || 0,
      author: { name: `Tác Giả ${data.author}` }
    }));
  } catch (error) {
    console.error("Error during API call:", error);
  }

  console.log("Fetched story details:", stories_filter);

    // Phân trang
    const page = parseInt(params.page || '1');
    const totalItems = stories_filter.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedStories = stories_filter.slice(startIndex, endIndex);

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
