import React from 'react';
import HomePage from "./Homepage";

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; 
import StoryListPage from './StoryListPage'; 
import StoryDetailPage from './StoryDetailPage'; 
//import ChapterPage from './ChapterPage'; 
import RegisterPage from './RegisterPage'; 
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
            <Route path="/stories/:categorySlug" element={<StoryListPage />} />
             <Route path="/truyen/:storySlug" element={<StoryDetailPage />} />
             {/*<Route path="/truyen/:storySlug/:chapterSlug" element={<ChapterPage />} />*/}
          </Route>
          <Route element={<MinimalLayout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider> 
  );
}

export default App;

