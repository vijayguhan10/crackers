import React from "react";

const StatCard = ({ icon, title, value, change, iconColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-full ${iconColor}`}>{icon}</div>
        <span
          className={`text-sm ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
