import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const EndCart = ({
  showPopup,
  gifts,
  quantities,
  id,
  setPdfUrl,
  cart,
  total,
  grandTotal,
  removeFromCart,
  discount,
  setDiscount,
  setCart,
}) => {
  console.log("id : ", id);
  useEffect(() => {
    console.log(
      "consoling the data in the endpopup for the giftbox : 😂 ",
      showPopup,
      quantities
    );
  }, [showPopup, gifts, quantities]);
  var token = localStorage.getItem("cracker_token");
  const [savedData, setSavedData] = useState(null);
  const [isGSTEnabled, setIsGSTEnabled] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18);
  const gstAmount = isGSTEnabled ? (total * gstPercentage) / 100 : 0;
  const calculatedGrandTotal = grandTotal + gstAmount;
  var requestData = {
    id: id,
    products: cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    })),
    giftboxes: [],
    discount,
    total,
    gst: {
      status: isGSTEnabled,
      percentage: gstPercentage,
      amount: gstAmount.toFixed(2),
    },
    grandtotal: calculatedGrandTotal.toFixed(2),
  };
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty! Add items to proceed.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/order/place-order`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response data after billing : ", response);

      console.log("response url : ", response.data.invoiceurl);
      if (response.status === 200 || response.status === 201) {
        setPdfUrl(response.data.invoiceurl);
        toast.success("Order placed successfully!");
        setCart([]);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };
  const handleSave = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty! Add items to save.");
      return;
    }

    setSavedData(requestData);

    try {
      const token = localStorage.getItem("cracker_token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/save`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="lg:w-full h-full">
        <div className="bg-white rounded-lg shadow p-6 h-full">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🛒 CART
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

              <div className="flex items-center gap-2 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isGSTEnabled}
                    onChange={() => setIsGSTEnabled(!isGSTEnabled)}
                  />
                  <span className="font-bold">Enable GST</span>
                </label>
                {isGSTEnabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(Number(e.target.value))}
                      className="w-20 p-1 border rounded text-right"
                    />
                    <span>%</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-2">
                <span>TOTAL:</span>
                <span>Rs. {total}</span>
              </div>
              {isGSTEnabled && (
                <div className="flex justify-between mb-2">
                  <span>GST ({gstPercentage}%):</span>
                  <span>Rs. {gstAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>GRAND TOTAL:</span>
                <span>Rs. {calculatedGrandTotal.toFixed(2)}</span>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Checkout
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  save
                </button>
                <button
                  onClick={() => setCart([])}
                  className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-300 text-white"
                >
                  Clear
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

export default EndCart;
