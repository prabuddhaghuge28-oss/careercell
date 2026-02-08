// Navbar.jsx
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();

  // Page name extraction and formatting
  const segments = location.pathname.split('/').filter(Boolean);
  let lastSeg = segments.length ? segments[segments.length - 1] : '';

  // If last segment looks like an id (24-hex ObjectId or numeric), use previous segment for display
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(lastSeg);
  const isNumericId = /^\d+$/.test(lastSeg);
  let displaySeg = lastSeg;
  if (isObjectId || isNumericId) {
    displaySeg = segments.length > 1 ? segments[segments.length - 2] : 'Details';
  }

  let pageName = displaySeg || 'Home';
  if (pageName === 'dashboard') pageName = "home";
  if (pageName === 'tpo') pageName = "TPO";

  // Convert hyphenated route segments to Title Case (e.g., job-listings -> Job Listings)
  const toTitleCase = (str) => {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  // map some common route names or convert automatically
  if (pageName === 'job' || pageName === 'jobs') pageName = 'Job';
  else pageName = toTitleCase(pageName);

  return (
    <div className={`h-20 sticky top-0 z-10 bg-surface flex justify-start items-center border-b border-primary-100 shadow-soft text-primary-800 transition-all duration-300 ${isSidebarVisible ? 'ml-60 px-4' : 'ml-0'}`}>
      <button className="ml-4" onClick={toggleSidebar}>
        <FaBars size={24} className="text-primary-700" />
      </button>
      <span className="ml-8 text-xl">
        {pageName}
      </span>
    </div>
  );
}

export default Navbar;
