import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Địa chỉ của backend (ở đây là localhost)

export const getStories = () => {
  // Hàm này sử dụng axios để gửi yêu cầu GET đến API endpoint /stories của backend
  return axios.get(`${API_URL}/stories`);
};
