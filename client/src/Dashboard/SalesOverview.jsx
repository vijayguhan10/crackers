import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
const SalesOverview = () => {
  const data = {
    labels: ["Sales Profit", "Expense"],
    datasets: [
      {
        data: [80, 20], 
        backgroundColor: ["#86EFAC", "#A78BFA"],
        hoverBackgroundColor: ["#4ADE80", "#C4B5FD"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-gray-500 text-sm mb-4">Sales Overview</h3>
      <div className="relative w-48 h-48 mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <span className="text-sm text-gray-500">Sales Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full" />
          <span className="text-sm text-gray-500">Expense</span>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
