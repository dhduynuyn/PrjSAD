import React from 'react';
import HomePage from "./Homepage";

import TeamListPage from './TeamListPage';
import { BrowserRouter, Routes, Route, Outlet, Link} from 'react-router-dom';
import { AuthProvider } from './AuthContext'; 
import StoryListPage from './StoryListPage'; 
import StoryDetailPage from './StoryDetailPage'; 
//import StoryDetailPage from './Demo/StoryDetailPage-demo'; 
import ChapterPage from './ChapterPage'; 
import SearchResultPage from './Search/SearchResultPage';
//import ChapterPage from './Demo/ChapterPage-demo'; 
import AdvancedSearchPage from './AdvancedSearchPage';
import RegisterPage from './RegisterPage'; 
import CategoryNav from "./CategoryNav";
import LoginPage from './LoginPage';   
import BookmarksPage from './User/BookmarksPage';
import CreateStoryPage from './User/Writter/CreateStoryPage'; 
import ChapterCreateEditPage from './User/Writter/ChapterCreateEditPage'; 
import StoryManagementPage from './User/Writter/StoryManagementPage'; 

import Header from './Header';      
import Footer from './Footer';       

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full"> 
      <Header />
      <CategoryNav />

      <main className="flex-grow w-full"> 
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
            {/*<Route path="/stories/:categorySlug" element={<StoryListPage />} />*/}
             <Route path="/truyen/:storySlug" element={<StoryDetailPage />} />
             <Route path="/truyen/:storySlug/:chapterSlug" element={<ChapterPage />} />
             <Route path="/tim-kiem-nang-cao" element={<AdvancedSearchPage />} />
             <Route path="/search-results" element={<SearchResultPage />} /> 
             <Route path="/teams" element={<TeamListPage />} /> 
             <Route path="/stories/:listTypeSlug" element={<StoryListPage />} />
             <Route path="/user/truyen-da-luu" element={<BookmarksPage/>} />
             <Route path="/user/dang-truyen" element={<CreateStoryPage/>} />
             <Route path="/user/quan-ly-truyen/:storySlug" element={<StoryManagementPage />} />
             <Route path="/user/quan-ly-truyen/:storySlug/them-chuong" element={<ChapterCreateEditPage />} />
             <Route path="/user/quan-ly-truyen/:storySlug/sua-chuong/:chapterId" element={<ChapterCreateEditPage />} />

             
          {/*</Route>
          <Route element={<MinimalLayout />}>*/}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider> 
  );
}

export default App;

