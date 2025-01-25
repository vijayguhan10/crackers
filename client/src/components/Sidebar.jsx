import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  History,
  Settings,
  LogOut,
  GiftIcon
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
console.log('ddd');
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('cracker_token');
    navigate('/signup');
  };

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      to: '/dashboard'
    },
    { icon: <Package className="w-5 h-5" />, label: 'Stocks', to: '/stocks' },
    { icon: <Users className="w-5 h-5" />, label: 'Customer', to: '/customer' },
    { icon: <History className="w-5 h-5" />, label: 'History', to: '/history' },
    { icon: <GiftIcon className="w-5 h-5" />, label: 'Gift', to: '/gift' }
  ];

  return (
    <div className="fixed font-pacifico left-0 top-0 h-full w-64 bg-[#04050fea] text-white p-4 hidden md:block">
      <div className="mb-8">
        <h1 className="text-6xl font-pacifico">
          <span className="text-[#fcdfff]">A</span>
          <span className="text-[#f6c9f6]">C</span>
          <span className="text-[#ee88ee]">S</span>
        </h1>
      </div>

      <nav className="space-y-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              location.pathname === item.to ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-4 space-y-4">
        <Link
          to="/settings"
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            location.pathname === '/settings'
              ? 'bg-white/10'
              : 'hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>SETTINGS</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>LOG OUT</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
