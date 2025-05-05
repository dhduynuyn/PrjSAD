import React from 'react';
import StoryGrid from '../StoryGrid'; 
export default function RelatedStoriesSection({ title = "Truyện liên quan", stories }) {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase mb-2">{title}</h3>
      <hr className="mb-4"/>
      <StoryGrid stories={stories} />
    </div>
  );
}
