import {useState} from 'react';
import { Link } from 'react-router-dom';
function Navbar({ handlePlaceChanged,setSearchInput,searchInput}) {
  

  const handleInputChange = (e) => {
    console.log('Search input:', e.target.value);
    setSearchInput(e.target.value);
  };
  return (
    <nav className="flex items-center justify-between bg-gray-800 px-4 py-3">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl">Travel App</span>
      </div>
      <div className="flex items-center flex-shrink-0 text-white mr-6">
      <Link to='/Trip'>
        <h1 className="font-semibold text-white">Trip</h1>
      </Link>
      </div>
      <div className="flex items-center">
        <input
            type="text"
            placeholder="Search..."
            className="py-2 px-4 mr-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900"
            value={searchInput}
            onChange={handleInputChange}
        />
       <button className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white" onClick={handlePlaceChanged}>
        Search
       </button>
      </div>
    </nav>
  );
}

export default Navbar;