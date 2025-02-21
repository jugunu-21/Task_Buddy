'use client';

interface FiltersAndSearchProps {
  VALUESEARCH: string;
  ONCHANGESEARCH: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ONCLICKBUTTON: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDueDate: string;
  setSelectedDueDate: (dueDate: string) => void;
}

export default function FiltersAndSearch({ 
  VALUESEARCH, 
  ONCHANGESEARCH, 
  ONCLICKBUTTON,
  selectedCategory,
  setSelectedCategory,
  selectedDueDate,
  setSelectedDueDate
}: FiltersAndSearchProps) {
  return (
    <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" suppressHydrationWarning>
          <div className="sm:flex flex-1 items-center gap-4 w-full order-2 sm:order-1" suppressHydrationWarning>
            <div suppressHydrationWarning>Filter by:</div>
            <div className='flex items-center gap-2' suppressHydrationWarning>
              <div className="w-40" suppressHydrationWarning>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-3xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  aria-label="Select category"
                  suppressHydrationWarning
                >
                  <option value="all" suppressHydrationWarning>Categories</option>
                  <option value="work" suppressHydrationWarning>Work</option>
                  <option value="personal" suppressHydrationWarning>Personal</option>
                </select>
              </div>
              <div className="w-40" suppressHydrationWarning>
                <select
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-3xl shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  aria-label="Select due date"
                  suppressHydrationWarning
                >
                  <option value="all" suppressHydrationWarning>Due Dates</option>
                  <option value="today" suppressHydrationWarning>Today</option>
                  <option value="tomorrow" suppressHydrationWarning>Tomorrow</option>
                  <option value="week" suppressHydrationWarning>This Week</option>
                  <option value="month" suppressHydrationWarning>This Month</option>
                </select>
              </div>
            </div>
          </div>
          <div className="relative w-full sm:w-48 order-3 sm:order-2" suppressHydrationWarning>
            <input
              type="text"
              value={VALUESEARCH}
              onChange={ONCHANGESEARCH}
              placeholder="Search tasks..."
              className="block w-full rounded-3xl pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              aria-label="Search tasks"
              suppressHydrationWarning
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" suppressHydrationWarning>
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" suppressHydrationWarning>
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <button
            onClick={ONCLICKBUTTON}
            type="button"
            suppressHydrationWarning
            className="ml-auto order-1 sm:order-3 px-4 py-2 bg-purple-600 text-white rounded-3xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              suppressHydrationWarning
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span suppressHydrationWarning>Add Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}