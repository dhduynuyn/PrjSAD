"use client";
import React, { useState } from "react";

export default function TabPanel({ tabs, children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-center items-start px-9 mt-4 w-full text-sm text-blue-600 whitespace-nowrap max-md:px-5">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-2.5 py-2 rounded-md ${
              activeTab === index ? "text-white bg-blue-600" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex flex-col pb-2 mt-4 w-full">
        {children[activeTab]}
      </div>
    </div>
  );
}
