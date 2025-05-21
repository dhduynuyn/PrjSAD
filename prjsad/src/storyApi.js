const ITEMS_PER_PAGE_LIST = 24; // Số item mỗi trang

const STATUS_OPTIONS = [
  { id: 28, label: 'Đã đủ bộ' },
  { id: 35, label: 'Đang phát hành' },
  { id: 36, label: 'Tạm ngưng' },
];

export const getStoriesApi = async (filters = {}) => {
  console.log("getStoriesApi", filters);

  // Gọi API thực tế
  const res = await fetch('http://localhost:5000/stories');
  if (!res.ok) {
    throw new Error(`API returned status ${res.status}`);
  }

  const stories = await res.json();
  console.log("API response:", stories);

  // Chuyển đổi dữ liệu sang định dạng frontend cần
  let stories_filter = stories.map(data => ({
    id: data.id,
    slug: data.id,
    title: data.title,
    coverUrl: data.coverUrl || (data.image_data ? `data:image/jpeg;base64,${data.image_data}` : `https://picsum.photos/seed/story${data.id}/200/260`),
    views: data.views,
    bookmarks: data.follows,
    latestChapter: { name: data.latest_chapter },
    isFull: data.status === 'Đã đủ bộ',
    status: data.status,
    totalChaptersNum: data.chapters?.length || 0,
    author: { name: `Tác Giả ${data.author}` }
  }));

  // Lọc theo status nếu có
  if (filters.status == '28') {
    stories_filter = stories_filter.filter(story => story.isFull);
  }

  // Phân trang phía frontend
  const page = parseInt(filters.page || '1');
  const totalItems = stories_filter.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_LIST);
  const startIndex = (page - 1) * ITEMS_PER_PAGE_LIST;
  const endIndex = startIndex + ITEMS_PER_PAGE_LIST;
  const paginatedStories = stories_filter.slice(startIndex, endIndex);

  return {
    data: paginatedStories,
    meta: {
      currentPage: page,
      lastPage: totalPages,
      totalItems: totalItems,
    }
  };
};
