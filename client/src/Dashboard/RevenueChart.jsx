import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const RevenueChart = ({ currentMonth, monthlyRevenue }) => {
  console.log("currentMonth", currentMonth);
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue,
        borderColor: "#4ADE80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#4ADE80",
        pointHoverBackgroundColor: "#4ADE80",
        pointHoverBorderColor: "#FFFFFF",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false, // Ensure all months are displayed
        },
      },
      y: {
        grid: {
          drawBorder: false,
          color: "#E5E7EB",
        },
        ticks: {
          stepSize: 20,
          callback: (value) => `₹ ${value}k`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      <div className="mb-4">
        <h3 className="text-gray-500 text-sm">Monthly Revenue</h3>
        <p className="text-2xl font-semibold mt-1">₹ {currentMonth}</p>
      </div>

      {/* Chart container */}
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
