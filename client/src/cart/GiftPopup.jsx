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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 text-black bg-gray-200 rounded shadow"
      >
        Open Gift Popup
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg w-[95%] md:w-[70%] lg:w-[50%] max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-900">
              Gift Items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-center text-gray-800">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="border border-gray-300 px-2 py-2">Name</th>
                    <th className="border border-gray-300 px-2 py-2">Stock</th>
                    <th className="border border-gray-300 px-2 py-2">Total</th>
                    <th className="border border-gray-300 px-2 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-2 py-2">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {gifts.map((gift) => (
                    <tr key={gift._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2">
                        {gift.name}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
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
                      <td className="border border-gray-300 px-2 py-2">
                        {gift.grandtotal}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setSelectedGifts((prev) =>
                              prev.map((item) =>
                                item._id === gift._id
                                  ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                                  : item
                              ).filter((item) => item.quantity > 0)
                            )}
                            className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500"
                            disabled={!SelectedGifts.find((item) => item._id === gift._id)}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min="0"
                            max={gift.stockavailable}
                            value={
                              SelectedGifts.find((item) => item._id === gift._id)?.quantity || 0
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10) || 0;
                              if (value > gift.stockavailable) {
                                toast.error(
                                  `Quantity exceeds the available stock of ${gift.stockavailable}`
                                );
                              } else {
                                setSelectedGifts((prev) =>
                                  prev.map((item) =>
                                    item._id === gift._id
                                      ? { ...item, quantity: value }
                                      : item
                                  )
                                );
                              }
                            }}
                            className="w-12 border rounded text-center"
                          />

                          <button
                            onClick={() => setSelectedGifts((prev) =>
                              prev.map((item) =>
                                item._id === gift._id
                                  ? { ...item, quantity: Math.min(gift.stockavailable, item.quantity + 1) }
                                  : item
                              )
                            )}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={gift.stockavailable === 0}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
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
        </div>
      )}
    </div>
  );
};

export default GiftPopup;
