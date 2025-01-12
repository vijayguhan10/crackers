import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, PhoneCallIcon, HomeIcon, MapIcon } from 'lucide-react';
const HistoryCard = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const token = localStorage.getItem('cracker_token');
      try {
        toast.info('Fetching customer data...');
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL}/customer/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('response of the Customer History :', response.data);
        setCustomerData(response.data);
        toast.success('Customer data fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch customer data. Please try again.');
        console.error(error);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      {customerData.map((customer) => (
        <div
          key={customer._id}
          className="flex flex-col bg-white rounded-lg shadow-lg p-6 overflow-hidden"
        >
          <div className="mb-4 flex flex-row">
            <div className="flex flex-col">
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
                <span className="pl-2">{customer.address}</span>
              </p>
            </div>
            <div className="flex items-center justify-center h-full ml-auto">
              <h1 className="text-2xl font-bold text-blue-600">
                ₹
                {customer.orders
                  .reduce((sum, order) => sum + order.grandtotal, 0)
                  .toLocaleString()}
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
                {customer.orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                    } border-b`}
                  >
                    <td className="p-2 text-center flex items-center justify-center space-x-2">
                      <Calendar className="text-gray-600" />
                      <span>
                        {new Date(order.createdat).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      ₹{order.grandtotal.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      <a
                        href={order.invoicepdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        Download
                      </a>
                    </td>
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
