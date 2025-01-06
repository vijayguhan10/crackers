import React from "react";
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      to: "/",
      active: true,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Invoice",
      to: "/billing",
    },
    { icon: <Package className="w-5 h-5" />, label: "Stocks", to: "/stocks" },
    { icon: <Users className="w-5 h-5" />, label: "Customer", to: "/customer" },
    { icon: <History className="w-5 h-5" />, label: "History", to: "/history" },
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
              item.active ? "bg-white/10" : "hover:bg-white/5"
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
          className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg"
        >
          <Settings className="w-5 h-5" />
          <span>SETTINGS</span>
        </Link>
        <Link
          to="/logout"
          className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>LOG OUT</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
