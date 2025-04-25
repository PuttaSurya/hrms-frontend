import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-main">
        <Sidebar />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;