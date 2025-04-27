import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronDown, ChevronRight, Users, ListTodo, List } from 'lucide-react';

const Sidebar = () => {
  const [masterExpanded, setMasterExpanded] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Retrieve user role from localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const styles = {
    sidebar: {
      width: '240px',
      backgroundColor: '#001F54', 
      padding: '0.5rem 1rem',
      height: '100vh',
      borderRight: '1px solid #003080', 
      color: '#ffffff'
    },
    sidebarHeader: {
      marginBottom: '10px'
    },
    sidebarMenu: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    menuItem: {
      marginBottom: '5px'
    },
    menuLink: {
      cursor: 'pointer',
      padding: '8px 10px', 
      borderRadius: '4px',
      transition: 'background-color 0.3s',
      color: '#ffffff',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center' 
    },
    menuContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', 
      color: '#ffffff',
      width: '100%'
    },
    menuLinkHover: {
      backgroundColor: '#002a6e'
    },
    menuText: {
      marginLeft: '10px',
      flexGrow: 1
    },
    submenu: {
      listStyle: 'none',
      marginTop: '5px',
      paddingLeft: '20px'
    },
    submenuItem: {
      marginBottom: '5px'
    },
    submenuLink: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#ffffff',
      padding: '5px 10px',
      borderRadius: '4px',
    },
    submenuLinkHover: {
      backgroundColor: '#002a6e'
    },
    submenuText: {
      marginLeft: '10px'
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        {/* Optional header content */}
      </div>
      <ul style={styles.sidebarMenu}>
        <li style={styles.menuItem}>
          <Link
            to="/leave-management"
            style={styles.menuLink}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.menuLinkHover.backgroundColor)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.menuContent}>
              <Calendar size={20} />
              <span style={styles.menuText}>Leave Management</span>
            </div>
          </Link>
        </li>
        {userRole === 'manager' && (
          <>
            <li style={styles.menuItem}>
              <Link 
                to="/pending-tasks" 
                style={styles.menuLink}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.menuLinkHover.backgroundColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={styles.menuContent}>
                  <ListTodo size={20} />
                  <span style={styles.menuText}>Pending Tasks</span>
                </div>
              </Link>
            </li>
            <li style={styles.menuItem}>
              <div
                style={styles.menuLink}
                onClick={() => setMasterExpanded(!masterExpanded)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.menuLinkHover.backgroundColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={styles.menuContent}>
                  <List size={20} />
                  <span style={styles.menuText}>Master</span>
                  {masterExpanded ? (
                    <ChevronDown size={20} style={{ marginLeft: 'auto' }} />
                  ) : (
                    <ChevronRight size={20} style={{ marginLeft: 'auto' }} />
                  )}
                </div>
              </div>
              {masterExpanded && (
                <ul style={styles.submenu}>
                  <li style={styles.submenuItem}>
                    <Link
                      to="/users"
                      style={styles.submenuLink}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.submenuLinkHover.backgroundColor)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Users size={18} />
                      <span style={styles.submenuText}>Users</span>
                    </Link>
                  </li>
                  {/* Add more submenu items if needed */}
                </ul>
              )}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;