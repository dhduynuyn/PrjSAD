import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FiEye, FiEyeOff } from 'react-icons/fi'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (formData.password !== formData.password_confirmation) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    console.log('Dữ liệu gửi đi:', formData);

    // 2. Gọi API đăng ký
    try {
      // const response = await yourRegisterApiFunction(formData); // Thay bằng hàm gọi API thật
      // console.log('Đăng ký thành công:', response);
      alert('Đăng ký thành công! (Đây là thông báo giả)'); // Thông báo tạm thời
      // 3. Điều hướng sau khi thành công (ví dụ: về trang đăng nhập hoặc trang chủ)
      navigate('/login'); // Chuyển đến trang đăng nhập sau khi đăng ký
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      // Hiển thị lỗi cho người dùng nếu cần
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    }
    // ---------------------------------
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8"> 
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10"> 
            <div className="mb-6 text-center"> 
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b40865568aeafdd7562b3e8c22cfe92486a1cd7d?apiKey=741f47dd65dd4c5584bc71eba79f2904" // Thay bằng logo của bạn nếu muốn
                width="120"
                alt="Logo"
                className="mx-auto" 
              />
            </div>
            <div className="text-center mb-6"> 
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tạo tài khoản mới</h2>
              <p className="text-sm text-gray-600">
                Điền thông tin bên dưới để tạo tài khoản
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}> 
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1" // Style cho label
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required 
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="example@user.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm pr-10" // Thêm padding phải cho icon
                    placeholder="Mật khẩu của bạn"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhập lại mật khẩu
                </label>
                 <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    id="password_confirmation"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm pr-10"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                   <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation && (
                  <p className="text-xs text-red-600 mt-1">Mật khẩu nhập lại không khớp.</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Đăng ký
                </button>
              </div>

              <div className="text-sm text-center">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-sky-600 hover:text-sky-500"
                  >
                    Đăng nhập ngay
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