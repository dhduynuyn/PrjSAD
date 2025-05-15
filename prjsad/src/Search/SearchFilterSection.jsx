import React from 'react';

export default function SearchFilterSection({ title, children }) {
  return (
    <div className="py-3">
      {title && <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>}
      {children}
      <div className="border-t border-gray-200 dark:border-gray-600 !mt-4"></div> 
    </div>
  );
}