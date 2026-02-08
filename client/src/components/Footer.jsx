import React from 'react';

function Footer({ isSidebarVisible }) {
  return (
    <>
      <div className={`bg-white bottom-0 right-0 border-t-2 border-gray-200 shadow-inner text-gray-600 transition-all duration-300 w-full ${isSidebarVisible ? 'md:ml-60 md:w-[calc(100%-15rem)] px-10' : 'ml-0 px-4'}`}>
        <div className="max-w-7xl mx-auto py-6">
          <p className="text-center text-sm text-gray-600">© 2025 CareerCell. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}
export default Footer
