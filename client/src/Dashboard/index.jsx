import React, { useState } from "react";
import {
  Menu,
  FileText,
  Package,
  Users,
  Star,
  LayoutDashboard,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { createSidebar } from "./SalesOverview";
import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import SalesOverview from "./SalesOverview";
import RecentInvoices from "./RecentInvoices";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#4A2A80] text-white p-4 transform transition-transform duration-200 ease-in-out z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="md:hidden p-2 hover:bg-gray-200 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 ml-4 md:ml-0">
            <h1 className="text-4xl">Welcome Vijay Guhan</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<LayoutDashboard className="w-6 h-6 text-white" />}
            title="Total Revenue"
            value="₹ 29,07,390"
            change={5.2}
            iconColor="bg-green-500"
          />
          <StatCard
            icon={<FileText className="w-6 h-6 text-white" />}
            title="Invoices"
            value="3,390"
            change={2.2}
            iconColor="bg-red-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-white" />}
            title="Customers"
            value="1,670"
            change={-3.1}
            iconColor="bg-green-500"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-white" />}
            title="Rating"
            value="4.1"
            change={2.3}
            iconColor="bg-red-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <SalesOverview />
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="grid grid-cols-1 gap-6">
          <RecentInvoices />
        </div>
      </div>
    </div>
  );
}

export default App;
