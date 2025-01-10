import React from "react";
import { Calendar, PhoneCallIcon, HomeIcon } from "lucide-react";
const PurchaseData = () => {
  const GifData = [
    {
      id: 1,
      name: "Diwali Delight Box",
      totalSales: 20,
      total: 200000,
    },
    {
      id: 2,
      name: "Festival Fiesta Pack",
      totalSales: 15,
      total: 150000,
    },
    {
      id: 3,
      name: "Cracker Carnival Box",
      totalSales: 18,
      total: 180000,
    },
    {
      id: 4,
      name: "Sparkle Supreme Set",
      totalSales: 22,
      total: 220000,
    },
    {
      id: 5,
      name: "Celebration Combo",
      totalSales: 19,
      total: 190000,
    },
    {
      id: 6,
      name: "Fireworks Fun Pack",
      totalSales: 25,
      total: 250000,
    },
    {
      id: 7,
      name: "Royal Cracker Box",
      totalSales: 30,
      total: 300000,
    },
    {
      id: 8,
      name: "Festive Sparks Bundle",
      totalSales: 17,
      total: 170000,
    },
  ];

  const TableData = [
    { dop: "12.10.2005", invoice: 1211, total: 20000 },
    { dop: "15.11.2006", invoice: 1212, total: 35000 },
    { dop: "20.09.2007", invoice: 1213, total: 15000 },
    { dop: "12.10.2005", invoice: 1211, total: 20000 },
    { dop: "15.11.2006", invoice: 1212, total: 35000 },
    { dop: "20.09.2007", invoice: 1213, total: 15000 },
    { dop: "12.10.2005", invoice: 1211, total: 20000 },
    { dop: "15.11.2006", invoice: 1212, total: 35000 },
    { dop: "20.09.2007", invoice: 1213, total: 15000 },
  ];

  return (
    <div>
      <h1 className="text-4xl mt-3 mb-3">Gift Sales Record</h1>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {GifData.map((gift) => (
          <div
            key={gift.id}
            className="flex flex-col bg-white rounded-lg shadow-lg p-6 overflow-hidden"
          >
            <div className=" mb-4 flex flex-row">
              <div className=" flex flex-col">
                <p className="text-sm text-gray-600 flex">
                  <HomeIcon size={16} color="green" />
                  <span className="pl-2 font-extrabold text-xl text-nowrap">
                    {gift.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600 flex">
                  <PhoneCallIcon size={16} color="green" />
                  <span className="pl-2">{gift.totalSales}</span>
                </p>
              </div>
              <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl font-bold ml-40 text-blue-600">
                  ₹{gift.total.toLocaleString()}
                </h1>
              </div>
            </div>
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 12px;
                background-color: #f4f4f4;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #4a5568;
                border-radius: 10px;
                border: 3px solid #f4f4f4;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #2d3748;
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseData;
