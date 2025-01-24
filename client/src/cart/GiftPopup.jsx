import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const GiftPopup = ({
  fetchGiftData,
  SelectedGifts,
  setSelectedGifts,
  showPopup,
  setShowPopup,
  gifts
}) => {
  const [editingGiftId, setEditingGiftId] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');
  const startEditing = (gift) => {
    setEditingGiftId(gift._id);
    setEditStockValue(gift.stockavailable);
  };
  const cancelEditing = () => {
    setEditingGiftId(null);
    setEditStockValue('');
  };
  const saveStock = async (giftId) => {
    const token = localStorage.getItem('cracker_token');

    try {
      await axios.put(
        `${process.env.REACT_APP_BASEURL}/giftbox/`,
        { _id: giftId, stockavailable: editStockValue },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift._id === giftId
            ? { ...gift, stockavailable: editStockValue }
            : gift
        )
      );

      toast.success('Stock updated successfully.');
      cancelEditing();
      fetchGiftData();
    } catch (error) {
      console.error('Error saving stock:', error);
      toast.error('Failed to save stock.');
    } finally {
      // setLoading(false);
    }
  };

  const handleQuantityChange = (gift, value) => {
    const existingGift = SelectedGifts.find((item) => item._id === gift._id);

    if (value > gift.stockavailable) {
      toast.error(
        `Quantity exceeds the available stock of ${gift.stockavailable}`
      );
      return;
    }

    if (existingGift) {
      setSelectedGifts(
        SelectedGifts.map((item) =>
          item._id === gift._id
            ? {
                ...item,
                quantity: Math.max(0, Math.min(gift.stockavailable, value))
              }
            : item
        )
      );
    } else {
      setSelectedGifts([
        ...SelectedGifts,
        { ...gift, quantity: Math.max(0, Math.min(gift.stockavailable, value)) }
      ]);
    }
  };

  const updateQuantity = (_id, delta) => {
    setSelectedGifts(
      SelectedGifts.map((item) =>
        item._id === _id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const handleInputChange = (gift, value) => {
    const newValue = parseInt(value, 10) || 0;
    handleQuantityChange(gift, newValue);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 text-black rounded shadow"
      >
        Open Gift Popup
      </button>
      {showPopup && (
        <div className="fixed inset-0 text-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[50%] p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Gift Items</h2>

            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Stock Available
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Grand Total
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Edit</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((gift) => (
                  <tr key={gift._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {gift.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingGiftId === gift._id ? (
                        <input
                          type="number"
                          value={editStockValue}
                          onChange={(e) => setEditStockValue(e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      ) : (
                        gift.stockavailable
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {gift.grandtotal}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateQuantity(gift._id, -1)}
                          className={`px-2 py-1 rounded ${
                            SelectedGifts.find((item) => item._id === gift._id)
                              ?.quantity === 0 ||
                            !SelectedGifts.find((item) => item._id === gift._id)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-400 text-white hover:bg-red-600'
                          }`}
                          disabled={
                            SelectedGifts.find((item) => item._id === gift._id)
                              ?.quantity === 0 ||
                            !SelectedGifts.find((item) => item._id === gift._id)
                          }
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min="0"
                          max={gift.stockavailable}
                          value={
                            SelectedGifts.find((item) => item._id === gift._id)
                              ?.quantity || 0
                          }
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10) || 0;

                            if (value > gift.stockavailable) {
                              toast.error(
                                `Quantity exceeds the available stock of ${gift.stockavailable}`
                              );
                            } else {
                              handleInputChange(gift, value);
                            }
                          }}
                          className={`w-16 border rounded text-center ${
                            gift.stockavailable === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={gift.stockavailable === 0}
                        />

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              gift,
                              (SelectedGifts.find(
                                (item) => item._id === gift._id
                              )?.quantity || 0) + 1
                            )
                          }
                          className={`px-2 py-1 rounded ${
                            gift.stockavailable === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-[#4ADE80] text-white hover:bg-green-600'
                          }`}
                          disabled={gift.stockavailable === 0}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingGiftId === gift._id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => saveStock(gift._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(gift)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftPopup;
