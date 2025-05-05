import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export default function Breadcrumbs({ items }) {
  // items là một mảng các object: [{ name: 'Trang chủ', link: '/' }, { name: 'Tên Truyện' }]
  return (
    <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-600 dark:text-gray-400">
      <ol className="list-none p-0 inline-flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <FiChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
            {item.link ? (
              <Link to={item.link} className="hover:text-sky-600 dark:hover:text-sky-400">
                {item.name}
              </Link>
            ) : (
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}