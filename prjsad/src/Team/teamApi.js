import qs from 'qs';
import axios from 'axios';

const USERS_PER_PAGE = 25;

export const getTeamsApi = async (params) => {
  console.log("API Call: getTeamsApi with params", params);
  let user_filter = [];
  
  // Khai báo biến bên ngoài try để chắc chắn có scope dùng được ở cuối hàm
  let total_pages = 0;
  let totalItems = 0;
  
  try {
    // Làm sạch tham số
    const cleanedParams = {};
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value) && value.length) {
        cleanedParams[key] = value;
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanedParams[key] = value;
      }
    }

    const { data } = await axios.get('http://localhost:5000/users/paginated', {
      params: cleanedParams,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });

    const { users = [], total_pages: tp = 0, total_items: ti = 0 } = data;
    
    total_pages = tp;
    totalItems = ti;

    user_filter = users.map(data => ({
      id: data.user_id,
      name: data.username,
      avatarUrl: data.profile_image 
        ? `data:image/jpeg;base64,${data.profile_image}` 
        : `https://picsum.photos/seed/useravatar${data.user_id}/200/200`,
      totalViews: data.views || 0,
      totalStories: data.stories_id?.length || 0,
    }));

  } catch (error) {
    console.error("Error during API call (getTeamsApi):", error);
  }

  const page = parseInt(params.page || '1');

  return {
    data: user_filter,
    meta: {
      currentPage: page,
      lastPage: total_pages,
      totalItems: totalItems,
    }
  };
};
