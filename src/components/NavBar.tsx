import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ activeTab = 'home' }) {
  return (
    <div className="fixed left-0 bottom-0 w-full">
      <div className="max-w-2xl mx-auto bg-white grid grid-cols-2 shadow-top">
        <Link
          to="/"
          className={`flex flex-col items-center py-2 ${activeTab === 'home' && 'text-blue-700'}`}>
          <img
            className="w-6 h-6"
            src={activeTab === 'home' ? '/images/home-blue.svg' : '/images/home.svg'}
            alt=""
          />
          <span>Home</span>
        </Link>
        <Link
          to="/bookmark/"
          className={`flex flex-col items-center py-2 ${activeTab === 'bookmark' && 'text-blue-700'}`}>
          <img
            className="w-6 h-6"
            src={activeTab === 'bookmark' ? '/images/bookmark-blue.svg' : '/images/bookmark.svg'}
            alt=""
          />
          <span>Bookmark</span>
        </Link>
      </div>
    </div>
  );
}
