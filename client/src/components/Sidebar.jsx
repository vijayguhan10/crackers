import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  History,
  Settings,
  LogOut,
  GiftIcon,
  Menu
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cracker_token');
    navigate('/signup');
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', to: '/dashboard' },
    { icon: <Package className="w-5 h-5" />, label: 'Stocks', to: '/stocks' },
    { icon: <Users className="w-5 h-5" />, label: 'Customer', to: '/customer' },
    { icon: <History className="w-5 h-5" />, label: 'History', to: '/history' },
    { icon: <GiftIcon className="w-5 h-5" />, label: 'Gift', to: '/gift' }
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}  
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white text-black"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#04050fea] text-white p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        } md:translate-x-0 md:block z-40`}
        onClick={() => setIsOpen(false)} // Close sidebar when clicking empty space
      >
        <div className="mb-8">
          <h1 className="text-6xl font-pacifico">
            <span className="text-[#fcdfff]">A</span>
            <span className="text-[#f6c9f6]">C</span>
            <span className="text-[#ee88ee]">S</span>
          </h1>
        </div>

        {/* Menu Items - Prevent Sidebar Closing */}
        <nav className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                location.pathname === item.to ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onClick={() => setIsOpen(false)} // Close sidebar on navigation
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Settings & Logout - Prevent Sidebar Closing */}
        <div className="absolute bottom-8 left-0 w-full px-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          <Link
            to="/settings"
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              location.pathname === '/settings' ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>SETTINGS</span>
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }} // Prevent closing on logout button click
            className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Overlay (Clicking Outside Closes Sidebar) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
