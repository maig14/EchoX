import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { CATEGORIES } from '../constants';

const Search: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-white p-4 pt-8 pb-32 overflow-y-auto no-scrollbar">
      {/* Search Input */}
      <div className="sticky top-0 bg-black z-10 pb-6 pt-2">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-3.5 text-gray-800 w-5 h-5 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            className="w-full bg-white text-black placeholder-gray-500 font-medium rounded-md py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Browse All Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Browse all</h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className={`${category.color} aspect-[1.6] rounded-md relative overflow-hidden p-3 cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-bold leading-tight break-words w-2/3">{category.name}</h3>
              {/* Decorative rotated box to simulate image */}
              <div className="absolute -bottom-2 -right-4 w-16 h-16 bg-black/20 transform rotate-[25deg] rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;