import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EndCart = ({
  SetSelectedGift,
  SelectedGift,
  showPopup,
  gifts,
  id,
  setPdfUrl,
  cart,
  discount,
  setDiscount,
  setCart,
  isGSTEnabled,
  setIsGSTEnabled,
  gstPercentage,
  setGstPercentage
}) => {
  console.log('id : ', id);
  useEffect(() => {
    console.log(
      'consoling the data in the endpopup for the giftbox : 😂 ',
      showPopup,
      SelectedGift
    );
  }, [showPopup, gifts, SelectedGift]);
  var token = localStorage.getItem('cracker_token');
  const [savedData, setSavedData] = useState(null);
  const selectedGiftTotal = SelectedGift.reduce(
    (sum, item) => sum + item.grandtotal * item.quantity,
    0
  );
  const updatedTotal =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    selectedGiftTotal;
  const grandTotal = updatedTotal - updatedTotal * (discount / 100);
  const gstAmount = isGSTEnabled ? (grandTotal * gstPercentage) / 100 : 0;
  const calculatedGrandTotal = grandTotal + gstAmount;
  const removeFromGift = (_id, type) => {
    SetSelectedGift(type.filter((item) => item._id !== _id));
  };
  const removeFromCart = (_id, type) => {
    setCart(type.filter((item) => item._id !== _id));
  };
  var requestData = {
    id: id,
    products: cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity
    })),
    giftboxes: SelectedGift.map((item) => ({
      giftBoxId: item._id,
      quantity: item.quantity
    })),
    discount,
    total: updatedTotal,
    gst: {
      status: isGSTEnabled,
      percentage: gstPercentage,
      amount: gstAmount.toFixed(2)
    },
    grandtotal: calculatedGrandTotal.toFixed(2)
  };
  const handleCheckout = async () => {
    if (cart.length === 0 && SelectedGift.length === 0) {
      toast.error('Cart is empty! Add items to proceed.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/order/place-order`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('response data after billing : ', response);

      console.log('response url : ', response.data.invoiceurl);
      if (response.status === 200 || response.status === 201) {
        setPdfUrl(response.data.invoiceurl);
        toast.success('Order placed successfully!');
        setCart([]);
        SetSelectedGift([]);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };
  const handleSave = async () => {
    setSavedData(requestData);

    try {
      const token = localStorage.getItem('cracker_token');
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/cart/save`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 201) {
        toast.success('Data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
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
                    <th className="p-2  text-wrap">Name</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Sub Total</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item._id} className="border-b text-nowrap">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 text-wrap">{item.name}</td>
                      <td className="p-8">{item.quantity}</td>
                      <td className="p-4">Rs. {item.price * item.quantity}</td>
                      <td className="p-2">
                        <button
                          onClick={() => removeFromCart(item._id, cart)}
                          className="bg-gray-200 p-1 rounded"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {SelectedGift.map((item, index) => {
                    return (
                      <tr key={item._id} className="border-b text-nowrap">
                        <td className="p-2">{cart.length + index + 1}</td>
                        <td className="p-2 text-wrap">{item.name}</td>
                        <td className="p-8">{item.quantity}</td>
                        <td className="p-4">
                          Rs. {item.grandtotal * item.quantity}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() =>
                              removeFromGift(item._id, SelectedGift)
                            }
                            className="bg-gray-200 p-1 rounded"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                <span>Rs. {updatedTotal}</span>
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
                  onClick={() => {
                    setCart([]);
                    SetSelectedGift([]);
                  }}
                  className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-300 text-white"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
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
        `}
      </style>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default EndCart;
