'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FiltersAndSearchProps {
  VALUESEARCH: string;
  ONCHANGESEARCH: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ONCLICKBUTTON: () => void;
}

export default function FiltersAndSearch({ VALUESEARCH, ONCHANGESEARCH, ONCLICKBUTTON }: FiltersAndSearchProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDueDate, setSelectedDueDate] = useState('all');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDueDate(e.target.value);
  };

  return (
    <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={ONCLICKBUTTON}
            className=" ml-auto order-1 sm:order-3 px-4 py-2 bg-purple-600 text-white rounded-3xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Task
          </button>
          <div className="sm:flex flex-1 items-center gap-4 w-full order-2 sm:order-1">
            <div>Filter by:</div>
            <div className='flex items-center gap-2 '>
            <div className="w-40">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-3xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="all"> Categories</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="w-40">
              <select
                value={selectedDueDate}
                onChange={handleDueDateChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-3xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="all">Due Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div></div>
          </div>
          <input
            type="text"
            value={VALUESEARCH}
            onChange={ONCHANGESEARCH}
            placeholder="Search tasks..."
            className="order-3 w-full sm:w-48 sm:order-2 block w-44 rounded-3xl pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}