import { useState, useEffect } from "react";
import axios from "axios";

function TotalTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");

  const fetchTransactions = async () => {
    const token = localStorage.getItem("cracker_token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/order/monthly-orders`,
        { year: selectedYear },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedYear]);

  const filteredTransactions = selectedMonth
    ? transactions[selectedMonth - 1] || []
    : transactions.flat();

  const displayedTransactions = filteredTransactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[26%] xl:w-[100%]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div>
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
                placeholder="Search Customer"
                className="w-full p-2 rounded-lg bg-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 text-black">
              <select
                id="month"
                className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-green-400"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">-- Choose Month --</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>

              <select
                id="year"
                className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80] focus:outline-none focus:ring-2 focus:ring-green-400"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto h-[300px] overflow-y-scroll custom-scrollbar">
            
            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border border-gray-800">
                  <td className="p-4 text-center border border-gray-800">
                    {transaction.id}
                  </td>
                  <td className="p-4 text-center border border-gray-800">
                    {transaction.name}
                  </td>
                  <td className="p-4 text-center border border-gray-800">
                    ₹{transaction.grandTotal.toLocaleString()}
                  </td>
                  <td className="p-4 text-center border border-gray-800">
                    {new Date(transaction.purchaseDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                  <td className="p-4 text-center border border-gray-800">
                    <a
                      href={transaction.invoiceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80]"
                    >
                      Invoice
                    </a>
                  </td>
                </tr>
              ))}

              {Array.from({
                length: Math.max(0, 10 - displayedTransactions.length),
              }).map((_, index) => (
                <tr key={`empty-${index}`} className="border border-gray-800">
                  <td className="p-4 text-center border border-gray-800">-</td>
                  <td className="p-4 text-center border border-gray-800">-</td>
                  <td className="p-4 text-center border border-gray-800">-</td>
                  <td className="p-4 text-center border border-gray-800">-</td>
                  <td className="p-4 text-center border border-gray-800">-</td>
                </tr>
              ))}
            </tbody>
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
