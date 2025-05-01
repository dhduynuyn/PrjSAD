import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FiEye, FiEyeOff } from 'react-icons/fi'; 

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
        alert("Vui lòng nhập email và mật khẩu.");
        return;
    }
    console.log('Dữ liệu gửi đi:', formData);

    // 2. Gọi API đăng nhập
    try {
      // const response = await yourLoginApiFunction(formData); // Thay bằng hàm gọi API thật
      // console.log('Đăng nhập thành công:', response);
      alert('Đăng nhập thành công! (Đây là thông báo giả)'); // Thông báo tạm thời

      // --- Ví dụ: Lưu thông tin user/token vào localStorage/context ---
      // localStorage.setItem('userToken', response.token);

      navigate('/'); // Chuyển về trang chủ sau khi đăng nhập
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8"> 
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10"> 
            <div className="mb-6 text-center"> 
              <img
                // src="https://monkeyd.net.vn/images/logo/Logo-MonkeyD.png" 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b40865568aeafdd7562b3e8c22cfe92486a1cd7d?apiKey=741f47dd65dd4c5584bc71eba79f2904" // Logo từ Header
                width="120"
                alt="Logo"
                className="mx-auto" 
              />
            </div>
            <div className="text-center mb-6"> 
               <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đăng nhập tài khoản</h2>
              <p className="text-sm text-gray-600">
                Vui lòng đăng nhập vào tài khoản của bạn
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}> 
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email" // dùng type="email" để trình duyệt hỗ trợ validation cơ bản
                  name="email"
                  id="email"
                  required
                  autoComplete="email" // Gợi ý tự động điền
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="example@user.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu
                </label>
                <div className="relative"> {/* Container cho input và nút ẩn/hiện */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    required
                    autoComplete="current-password" // Gợi ý tự động điền
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm pr-10" // Thêm padding phải
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm"> 
                <Link
                  to="/forgot-password" 
                  className="font-medium text-sky-600 hover:text-sky-500"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Đăng nhập
                </button>
              </div>

              <div className="text-sm text-center">
                <p className="text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link
                    to="/register" 
                    className="font-medium text-sky-600 hover:text-sky-500"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}