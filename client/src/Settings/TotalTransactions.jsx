import { useState } from "react";
function TotalTransactions() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const purchasedata = [
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
    {
      id: "187499",
      name: "Vijay Guhan",
      invoice: 1211,
      totalAmount: 1000000,
      purchase: "12.10.2005",
    },
  ];

  return (
    <div className=" h-[26%]  xl:w-[100%]">
      <div className=" flex flex-col lg:flex-row gap-6">
        <div className="">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wallet-cards"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
                <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
              </svg>
              Total Transactions
            </h2>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 rounded-lg bg-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 text-black">
              {/* <label htmlFor="month" className="text-gray-700 font-medium">
                Select Month:
              </label> */}
              <select
                id="month"
                className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="" className="text-black">
                  -- Choose Month --
                </option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow h-[15%] overflow-y-scroll custom-scrollbar">
            <table className="w-full border border-gray-800">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4 text-center border border-gray-800">ID</th>
                  <th className="p-4 text-center border border-gray-800">
                    Name
                  </th>
                  <th className="p-4 text-center border border-gray-800">
                    Invoice
                  </th>
                  <th className="p-4 text-center border border-gray-800">
                    Datte of purchase
                  </th>
                  <th className="p-4 text-center border border-gray-800">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchasedata.map((data) => (
                  <tr key={data.id} className="border border-gray-800">
                    <td className="p-4 text-center border border-gray-800">
                      {data.id}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      {data.name}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      {data.invoice}
                    </td>

                    <td className="p-4 text-center border border-gray-800">
                      {data.purchase}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      <button className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80]">
                        Download Invoice
                      </button>{" "}
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
      </div>
    </div>
  );
}

export default TotalTransactions;
