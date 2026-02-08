import React from 'react';
import NoticeBox from '../../components/NoticeBox';
// Notification component removed

// student 
function Home() {
  // Set the page title
  document.title = 'CareerCell | Student Dashboard';

  return (
    <>
      <div className={`grid grid-cols-1 gap-2`}>
        <NoticeBox />
      </div>
    </>
  );
}

export default Home
