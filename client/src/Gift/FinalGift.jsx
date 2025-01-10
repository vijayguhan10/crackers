import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Wallet } from "lucide-react";
const FinalGift = ({
  selectedGift,
  cart,
  total,
  grandTotal,
  removeFromCart,
  discount,
  setDiscount,
  setCart,
}) => {
  const calculatedGrandTotal = grandTotal;
  const [giftBoxName, setGiftBoxName] = useState("");
  const [GiftBoxCount, setGiftBoxCount] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty! Add items to proceed.");
      return;
    }

    if (!giftBoxName) {
      toast.error("Please enter the gift box name.");
      return;
    }

    if (!GiftBoxCount || GiftBoxCount <= 0) {
      toast.error("Please enter a valid stock count for the gift box.");
      return;
    }

    const requestData = {
      name: giftBoxName,
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      discount,
      total,
      grandtotal: calculatedGrandTotal.toFixed(2),
      stockavailable: Number(GiftBoxCount),
    };

    const token = localStorage.getItem("cracker_token");
    const decoded = jwtDecode(token);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/giftbox`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Gift box created successfully!");
        setCart([]);
        setGiftBoxName("");
        setGiftBoxCount("");
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error creating gift box:", error);
      toast.error("Failed to create gift box. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="lg:w-full h-full">
        <div className="bg-white rounded-lg shadow p-6 h-full">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Wallet /> Final Gift Evaluation
          </h2>
          <div>
            <div className="mb-4 h-[300px] overflow-y-scroll custom-scrollbar overflow-x-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 sticky top-0 z-10 text-white">
                  <tr>
                    <th className="p-2">S.No</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2 text-nowrap">Sub Total</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item._id} className="border-b text-nowrap">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-8">{item.quantity}</td>
                      <td className="p-4">Rs. {item.price * item.quantity}</td>
                      <td className="p-2">
                        <button
                          onClick={() => removeFromCart(item._id)}
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
              <div className="mb-4">
                <label htmlFor="giftBoxName" className="block font-bold mb-2">
                  Enter the Gift Box Name
                </label>
                <input
                  id="giftBoxName"
                  type="text"
                  value={giftBoxName}
                  onChange={(e) => setGiftBoxName(e.target.value)}
                  placeholder="Gift Box Name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="giftBoxName" className="block font-bold mb-2">
                  Enter the Availability of the GiftBox
                </label>
                <input
                  id="GiftBoxCount"
                  type="number"
                  min={0}
                  value={GiftBoxCount}
                  onChange={(e) => setGiftBoxCount(e.target.value)}
                  placeholder="Gift Box Name"
                  className="w-full p-2 border rounded"
                />
              </div>
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
                <span>Rs. {calculatedGrandTotal.toFixed(2)}</span>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCart([])}
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Create gift box
                </button>
              </div>
            </div>
          </div>
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
      <ToastContainer />
    </div>
  );
};

export default FinalGift;
