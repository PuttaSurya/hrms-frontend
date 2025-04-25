import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully', {
      description: "You have been logged out of your account.",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>MyLeaveCalendar</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <User size={24} style={userIconStyle} />
        <span style={{ marginRight: '50px', fontWeight: 'bold' }}>{fullName}</span>
        <LogOut 
          size={24} 
          onClick={handleLogout} 
          style={logoutIconStyle} 
          title="Logout"
        />
      </div>
    </nav>
  );
};

const userIconStyle = {
  marginRight: '10px',
  color: '#333'
};

const logoutIconStyle = {
  cursor: 'pointer',
  color: '#333',
  transition: 'color 0.3s ease'
};

export default Navbar;