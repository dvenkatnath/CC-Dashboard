import React from 'react';
import { BellIcon, SearchIcon, UserIcon } from 'lucide-react';
export function Header() {
  return <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="relative">
        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64" />
        <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <BellIcon size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            ST
          </div>
        </div>
      </div>
    </header>;
}