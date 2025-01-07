import React from "react";
import { ListEndIcon } from "lucide-react";
const FinalGift = ({
  cart,
  total,
  grandTotal,
  removeFromCart,
  discount,
  setDiscount,
  setCart,
}) => {
  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ListEndIcon /> Final Gift Evaluation
        </h2>
        <div className="mb-4">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2">S.No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Quantity</th>
                <th className="p-2 text-nowrap">Sub Total</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b text-nowrap">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-8">{item.quantity}</td>
                  <td className="p-4">Rs. {item.price * item.quantity}</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-gray-200 p-1 rounded"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💫</span>
            <span className="font-bold">DISCOUNT</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20 p-1 border rounded text-right"
            />
            <span>%</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>TOTAL:</span>
            <span>Rs. {total}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>GRAND TOTAL:</span>
            <span>Rs. {grandTotal}</span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setCart([])}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
            <button className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700">
            Create Gift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalGift;
