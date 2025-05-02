import React from 'react';
import HomePage from "./Homepage";

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// --- Giả sử bạn đã tổ chức lại các components vào các thư mục ---
// --- Nếu chưa, hãy điều chỉnh đường dẫn import cho phù hợp ---
import RegisterPage from './RegisterPage'; // Trang đăng ký bạn vừa tạo
import LoginPage from './LoginPage';    
import Header from './Header';      
import Footer from './Footer';       

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Header />
      <main className="flex-grow"> 
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

function MinimalLayout() {
    return (
        <Outlet />
    );
}


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route element={<MinimalLayout />}> 
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Route>


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

