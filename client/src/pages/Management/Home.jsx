import React from 'react';
import NoticeBox from '../../components/NoticeBox';

// management
function Home() {
  document.title = 'CareerCell | Management Dashboard';
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <NoticeBox />
      </div>
    </>
  )
}

export default Home
