import React, { useEffect, useState } from "react";
import Header from "./Header";
//import CategoryNav from "./CategoryNav";
import FeaturedSection from "./FeaturedSection";
import UpdatedStoriesSection from "./UpdatedStoriesSection";
//import CreativeStoriesSection from "./CreativeStoriesSection";
import CompletedStoriesSection from "./CompletedStoriesSection";
import CategoryGrid from "./CategoryGrid";
import Footer from "./Footer";

export default function HomePage() {
  const [completedStories, setCompletedStories] = useState([]);

  return (
    <div className="flex flex-col justify-center py-px">
      {/*<CategoryNav />*/}
      <main className="flex flex-col self-center px-3 pb-96 max-w-full w-[1320px] max-md:pb-24">
        <FeaturedSection />
        <UpdatedStoriesSection />
        {/*<CreativeStoriesSection />*/}
        <CompletedStoriesSection stories={completedStories} /> {/* 👈 Truyền props */}
        <CategoryGrid />
      </main>
    </div>
  );
}
