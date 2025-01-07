import React from "react";
import {
  Calendar,
  PhoneCallIcon,
  HomeIcon,
} from "lucide-react";

import { MapIcon } from "lucide-react";
const HistoryCard = () => {
  const CustomerData = [
    {
      id: 1,
      name: "Vijay Guhan",
      phone: "8438434868",
      location: "Salem",
      total: 200000,
    },
    {
      id: 2,
      name: "Arjun Kumar",
      phone: "9888776655",
      location: "Chennai",
      total: 150000,
    },
    {
      id: 3,
      name: "Maya Raj",
      phone: "9090901234",
      location: "Madurai",
      total: 180000,
    },
    {
      id: 4,
      name: "Karthik Rao",
      phone: "8123456789",
      location: "Coimbatore",
      total: 220000,
    },
    {
      id: 5,
      name: "Sneha Patel",
      phone: "8877665544",
      location: "Trichy",
      total: 175000,
    },
    {
      id: 6,
      name: "Priya Suresh",
      phone: "9123456780",
      location: "Salem",
      total: 240000,
    },
    {
      id: 7,
      name: "Rajesh Kumar",
      phone: "7012345678",
      location: "Chennai",
      total: 300000,
    },
    {
      id: 8,
      name: "Meena Raj",
      phone: "8098765432",
      location: "Madurai",
      total: 190000,
    },
    {
      id: 9,
      name: "Ajay Menon",
      phone: "9898989898",
      location: "Coimbatore",
      total: 210000,
    },
    {
      id: 10,
      name: "Divya Nair",
      phone: "8765432190",
      location: "Trichy",
      total: 250000,
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
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      {CustomerData.map((customer) => (
        <div
          key={customer.id}
          className="flex flex-col bg-white rounded-lg shadow-lg p-6 overflow-hidden"
        >
          <div className=" mb-4 flex flex-row">
            <div className=" flex flex-col">
              <p className="text-sm text-gray-600 flex">
                <HomeIcon size={16} color="green" />
                <span className="pl-2 font-extrabold text-xl">
                  {customer.name}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex">
                <PhoneCallIcon size={16} color="green" />
                <span className="pl-2">{customer.phone}</span>
              </p>
              <p className="text-sm text-gray-600 flex">
                <MapIcon size={16} color="green" />
                <span className="pl-2">{customer.location}</span>
              </p>
            </div>
            <div className="flex items-center justify-center h-full">
              <h1 className="text-2xl font-bold ml-72 text-blue-600">
                ₹{customer.total.toLocaleString()}
              </h1>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-y-scroll custom-scrollbar h-40">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2 text-center">Total</th>
                  <th className="p-2 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {TableData.map((data, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } border-b`}
                  >
                    <td className="p-2 text-center flex items-center justify-center space-x-2">
                      <Calendar className="text-gray-600" />
                      <span>{data.dop}</span>
                    </td>
                    <td className="p-2 text-center">
                      ₹{data.total.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">{data.invoice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
};

export default HistoryCard;
