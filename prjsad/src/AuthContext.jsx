import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Ban đầu chưa đăng nhập, user là null
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Lấy token từ localStorage khi khởi tạo
  const [isLoading, setIsLoading] = useState(true); // Để xử lý trạng thái tải ban đầu

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            // Nếu user lưu trữ bị lỗi, xóa đi
            localStorage.removeItem('authUser');
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
          }
        } else {
          // Nếu chỉ có token mà không có user (ví dụ: user đóng tab giữa chừng khi đang fetch user)
          // Gọi API /api/user/me ở đây để lấy lại thông tin user
          // Hoặc đơn giản là yêu cầu đăng nhập lại bằng cách xóa token
          // Lấy lại thông tin user nếu chỉ có token
          try {
            // GỌI API LẤY USER INFO ---
            // Giả sử có endpoint /api/auth/me để lấy thông tin user dựa trên token
            const response = await fetch('/api/auth/me', { // THAY THẾ ENDPOINT NÀY
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              localStorage.setItem('authUser', JSON.stringify(userData));
            } else {
              // Token không hợp lệ hoặc đã hết hạn
              console.warn("Token invalid or expired during initialization.");
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error("Error fetching user on init:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false); // Đánh dấu đã tải xong
    };

    initializeAuth();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Hàm để gọi khi đăng nhập thành công từ API
  // userDataFromApi nên chứa thông tin user
  // authTokenFromApi là token nhận được


  // Hàm để gọi khi đăng nhập thành công
  const login = (userDataFromApi, authTokenFromApi) => {
    localStorage.setItem('authToken', authTokenFromApi);
    localStorage.setItem('authUser', JSON.stringify(userDataFromApi));
    setToken(authTokenFromApi);
    setUser(userDataFromApi);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  // Hàm để cập nhật thông tin user (ví dụ sau khi chỉnh sửa profile)
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('authUser', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token, // Cung cấp token ra ngoài nếu các component khác cần trực tiếp
    isAuthenticated: !!user && !!token, // User được coi là authenticated khi có cả user object và token
    login,
    logout,
    updateUser, // Thêm hàm cập nhật user
    isLoadingAuth: isLoading, // Trạng thái để biết AuthContext đã sẵn sàng hay chưa
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};