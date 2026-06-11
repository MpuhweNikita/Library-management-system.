import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaBook, 
  FaList, 
  FaUsers, 
  FaBookReader, 
  FaUser, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaBars, 
  FaTimes,
  FaCog
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt />, roles: ['ADMIN', 'LIBRARIAN', 'USER'] },
    { name: 'Books', path: '/books', icon: <FaBook />, roles: ['ADMIN', 'LIBRARIAN', 'USER'] },
    { name: 'Categories', path: '/categories', icon: <FaList />, roles: ['ADMIN', 'LIBRARIAN'] },
    { name: 'Users', path: '/users', icon: <FaUsers />, roles: ['ADMIN'] },
    { name: 'Borrowings', path: '/borrows', icon: <FaBookReader />, roles: ['ADMIN', 'LIBRARIAN', 'USER'] },
    { name: 'Profile', path: '/profile', icon: <FaUser />, roles: ['ADMIN', 'LIBRARIAN', 'USER'] },
    { name: 'Settings', path: '/settings', icon: <FaCog />, roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-slate)' }}>
      {/* Sidebar - Desktop */}
      <aside 
        className={`bg-dark text-white border-end d-none d-md-flex flex-column transition-all`}
        style={{ 
          width: collapsed ? '80px' : '260px', 
          transition: 'width 0.3s ease-in-out',
          background: 'var(--sidebar-gradient)',
          boxShadow: '4px 0 15px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25">
          {!collapsed && (
            <Link to="/dashboard" className="text-white text-decoration-none d-flex align-items-center gap-2">
              <div className="rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}>
                <FaBook className="fs-5 text-white" />
              </div>
              <span className="fw-bold fs-5 tracking-wide">SmartLib</span>
            </Link>
          )}
          {collapsed && (
            <div className="rounded p-2 mx-auto d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}>
              <FaBook className="fs-5 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-grow-1 py-4">
          <ul className="list-unstyled px-2">
            {filteredMenuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link 
                  to={item.path} 
                  className={`nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded transition-all hover-nav ${isActive(item.path)}`}
                  style={{ fontSize: '15px' }}
                >
                  <span className="fs-5 text-white">{item.icon}</span>
                  {!collapsed && <span className="menu-text text-white">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-top border-secondary border-opacity-25">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Offcanvas */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        >
          <aside 
            className="bg-dark text-white h-100 d-flex flex-column"
            style={{ 
              width: '260px',
              background: 'var(--sidebar-gradient)',
              boxShadow: '4px 0 15px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-25">
              <Link to="/dashboard" className="text-white text-decoration-none d-flex align-items-center gap-2">
                <div className="rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-purple)' }}>
                  <FaBook className="fs-5 text-white" />
                </div>
                <span className="fw-bold fs-5">SmartLib</span>
              </Link>
              <button className="btn text-white" onClick={() => setMobileOpen(false)}>
                <FaTimes />
              </button>
            </div>
            
            <nav className="flex-grow-1 py-4">
              <ul className="list-unstyled px-2">
                {filteredMenuItems.map((item, index) => (
                  <li key={index} className="mb-2">
                    <Link 
                      to={item.path} 
                      className={`nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded hover-nav ${isActive(item.path)}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="fs-5 text-white">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-3 border-top border-secondary border-opacity-25">
              <button 
                onClick={handleLogout}
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Top Navbar */}
        <header className="navbar navbar-expand navbar-light bg-white px-4 border-bottom shadow-sm" style={{ height: '70px' }}>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <button 
                className="btn btn-light d-none d-md-block" 
                onClick={() => setCollapsed(!collapsed)}
              >
                <FaBars />
              </button>
              <button 
                className="btn btn-light d-md-none" 
                onClick={() => setMobileOpen(true)}
              >
                <FaBars />
              </button>
              <h5 className="mb-0 fw-bold d-none d-sm-block text-secondary">Library Management Console</h5>
            </div>

            {/* Profile Dropdown */}
            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-md-block">
                <div className="fw-semibold text-dark">{user?.firstName} {user?.lastName}</div>
                <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-10" style={{ fontSize: '11px' }}>
                  {user?.role}
                </span>
              </div>
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '42px', height: '42px', fontSize: '16px', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', background: 'var(--sunset-gradient)' }}
              >
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Inject css directly for menu interactions */}
      <style>{`
        .hover-nav:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
        }
        .hover-nav.active {
          background: var(--primary-gradient) !important;
          color: #fff !important;
          box-shadow: 0 4px 12px rgba(200, 90, 23, 0.25);
        }
        .transition-all {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;
