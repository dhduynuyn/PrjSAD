export const getTeamsApi = async (params) => {
  // params sẽ là { search: 'searchTerm', page: 1 }
  console.log("API Call (Mocked): getTeamsApi with params", params);

  // Dữ liệu giả lập lớn hơn
  const ALL_MOCK_TEAMS_DATA = Array.from({ length: 70 }, (_, i) => ({
    id: `team-id-${i + 1}`,
    name: `Nhóm Dịch ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + Math.floor(i / 26))}`,
    avatarUrl: `https://picsum.photos/seed/teamavatar${i}/200/200`,
    totalViews: Math.floor(Math.random() * 20000000) + 100000,
    totalStories: Math.floor(Math.random() * 300) + 5,
  }));

  return new Promise(resolve => setTimeout(() => {
    let filteredTeams = [...ALL_MOCK_TEAMS_DATA];

    if (params.search) {
      const searchTermLower = params.search.toLowerCase();
      filteredTeams = filteredTeams.filter(team =>
        team.name.toLowerCase().includes(searchTermLower)
      );
    }

    // Phân trang
    const page = parseInt(params.page || '1');
    const itemsPerPage = 24; // Số team hiển thị mỗi trang
    const totalItems = filteredTeams.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedTeams = filteredTeams.slice(startIndex, startIndex + itemsPerPage);

    resolve({
      data: paginatedTeams,
      meta: {
        currentPage: page,
        lastPage: totalPages,
        totalItems: totalItems,
      }
    });
  }, 500)); // Giả lập độ trễ
};