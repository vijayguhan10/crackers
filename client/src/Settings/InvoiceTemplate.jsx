import React from "react";

const InvoiceTemplate = () => {
  return (
    <div className="p-5">
      <h1 className="text-4xl mb-3">Sample Invoice Generation Template</h1>
      <div className="flex justify-between items-center p-5 bg-black text-white">
        <div>
          <h1 className="text-2xl">Avantika Crackers</h1>
          <p className="text-sm">Make all checks payable to Utu Linna</p>
        </div>
        <div className="text-right">
          <h3 className="text-lg">Invoice #5465</h3>
          <p className="text-sm">8/8/2023</p>
        </div>
      </div>
      <div className="mt-5 border-b-2 pb-2">
        <table className="w-full border-collapse">
          <tr>
            <td className="w-1/5 font-bold">TO</td>
            <td className="w-2/5">
              Utu Linna
              <br />
              Kendall Collins DDS
            </td>
            <td className="w-1/5 font-bold">CUSTOMER ID</td>
            <td className="w-2/5">ABK967</td>
          </tr>
          <tr>
            <td className="font-bold">ADDRESS</td>
            <td>
              234 5th Ave
              <br />
              Madison, WI 12131
            </td>
            <td className="font-bold">PHONE</td>
            <td>640-555-0146</td>
          </tr>
        </table>
      </div>

      <div className="mt-5 border-b-2 pb-2">
        <table className="w-full border-collapse">
          <tr>
            <td className="w-1/5 font-bold">SALESPERSON</td>
            <td className="w-2/5">Jane</td>
            <td className="w-1/5 font-bold">JOB</td>
            <td className="w-2/5">Dental Instrument Resupply</td>
          </tr>
          <tr>
            <td className="font-bold">PAYMENT TERMS</td>
            <td>Due upon receipt</td>
            <td className="font-bold">DUE DATE</td>
            <td>8/8/2023</td>
          </tr>
        </table>
      </div>

      <div className="mt-5">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300 font-bold">QTY</th>
              <th className="p-2 border border-gray-300 font-bold">
                DESCRIPTION
              </th>
              <th className="p-2 border border-gray-300 font-bold">
                UNIT PRICE
              </th>
              <th className="p-2 border border-gray-300 font-bold">
                LINE TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-gray-300">100</td>
              <td className="p-2 border border-gray-300">Crackers</td>
              <td className="p-2 border border-gray-300">$0.25</td>
              <td className="p-2 border border-gray-300">$25</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300">6</td>
              <td className="p-2 border border-gray-300">Crackers</td>
              <td className="p-2 border border-gray-300">$645.23</td>
              <td className="p-2 border border-gray-300">$3871.38</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300">100</td>
              <td className="p-2 border border-gray-300">Crackers</td>
              <td className="p-2 border border-gray-300">$0.12</td>
              <td className="p-2 border border-gray-300">$12</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300">25</td>
              <td className="p-2 border border-gray-300">Crackers</td>
              <td className="p-2 border border-gray-300">$1.33</td>
              <td className="p-2 border border-gray-300">$33.25</td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300">100</td>
              <td className="p-2 border border-gray-300">Crackers</td>
              <td className="p-2 border border-gray-300">$0.22</td>
              <td className="p-2 border border-gray-300">$22</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 text-right">
        <p className="my-1 font-bold">SUBTOTAL: $3,963.63</p>
        <p className="my-1 font-bold">SALES TAX: 0.06</p>
        <p className="my-1 text-xl font-bold">TOTAL: $4,201.45</p>
      </div>

      <div className="mt-8 flex justify-between items-center p-2 bg-black text-white">
        <div>
          <p className="text-sm">234-555-0126</p>
          <p className="text-sm">happytooth@example.com</p>
          <p className="text-sm">4321 Maplewood Ave | Nashville, TN 13141</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">THANK YOU</h2>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
