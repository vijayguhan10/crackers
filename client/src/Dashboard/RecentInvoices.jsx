import React from "react";

const RecentInvoices = ({ invoices }) => {
  console.log("Invoice Data: ", invoices);
  console.log("isarray:", invoices?.isarray);

  // const invoices = [
  //   {
  //     id: "2345",
  //     date: "23-10-2024",
  //     client: "Daniel",
  //     amount: "₹2,090",
  //     status: "Paid",
  //   },
  //   {
  //     id: "2346",
  //     date: "22-10-2024",
  //     client: "Sophia",
  //     amount: "₹3,150",
  //     status: "Overdue",
  //   },
  //   {
  //     id: "2347",
  //     date: "21-10-2024",
  //     client: "Liam",
  //     amount: "₹1,780",
  //     status: "Paid",
  //   },
  // ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-gray-600 text-sm mb-4 font-medium">
        Recent Invoices
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b border-gray-200">
              <th className="py-3 px-4 border-x border-gray-300">Invoice No</th>
              <th className="py-3 px-4 border-x border-gray-300">
                Date Created
              </th>
              <th className="py-3 px-4 border-x border-gray-300">Client</th>
              <th className="py-3 px-4 border-x border-gray-300">Amount</th>
              <th className="py-3 px-4 border-x border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <tr
                  key={index}
                  className={`text-sm border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-4 border-x border-gray-300 font-medium text-gray-700">
                    {invoice.id}
                  </td>
                  <td className="py-3 px-4 border-x border-gray-300 text-gray-600">
                    {new Date(invoice.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 border-x border-gray-300 text-gray-600">
                    {invoice.customerName}
                  </td>
                  <td className="py-3 px-4 border-x border-gray-300 text-gray-600">
                    {invoice.amount}
                  </td>
                  <td className="py-3 px-4 border-x border-gray-300 text-center">
                    <a
                      href={invoice.invoiceLink} // Replace with your invoice URL property
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      Download Invoice
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center text-gray-600">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentInvoices;
