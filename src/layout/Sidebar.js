import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/leave-management">
            <Calendar size={20} />
            <span>Leave Management</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;