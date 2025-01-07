import React from "react";
import {
  UserIcon,
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import TotalTransactions from "./TotalTransactions";
import Header from "../components/Header";
const UserData = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-row xl:h-96 xl:w-full pt-5">
        <div className="bg-white  rounded-lg  ">
          <div className="flex space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserIcon size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Vijay Guhan</h1>
              <h2 className="text-sm text-gray-500">Customer ID: #12345</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <PhoneIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">8438434858</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">
                Salem, Vaikkal Pattarai, Allikuttai P/O
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <DollarSignIcon size={20} className="text-green-500" />
              <p className="text-gray-700 font-medium">
                <span className="font-bold text-gray-900">Total Revenue:</span>{" "}
                ₹2,000,000
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">
                <span className="font-bold text-gray-900">
                  Date of Joining:
                </span>{" "}
                12/10/2016
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
              Edit Profile
            </button>
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
              View Transactions
            </button>
          </div>
        </div>
        <div className="ml-[23%]">
          <TotalTransactions />
        </div>
      </div>
      <div className="border border-black mt-10"></div>
    </div>
  );
};

export default UserData;
