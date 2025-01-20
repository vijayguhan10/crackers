import React, { useState, useEffect } from "react";
import axios from "axios";

const GiftPopup = ({ showPopup, setShowPopup, quantities, setQuantities }) => {
  //   const [showPopup, setShowPopup] = useState(false);
  const [gifts, setGifts] = useState([]);
  //   const [quantities, setQuantities] = useState({});
  const fetchGiftData = async () => {
    try {
      console.log("triggered");
      const token = localStorage.getItem("cracker_token");

      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/giftbox`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response  : ", response);
      setGifts(response.data);
      const initialQuantities = {};
      response.data.forEach((item) => {
        initialQuantities[item._id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching gift data:", error);
    }
  };

  useEffect(() => {
    fetchGiftData();
  }, []);

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2  text-black rounded shadow"
      >
        Open Gift Popup
      </button>
      {showPopup && (
        <div className="fixed inset-0 bg- text-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Gift Items</h2>
            <ul className="space-y-4">
              {gifts.map((gift) => (
                <li
                  key={gift._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{gift.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDecrement(gift._id)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-4">{quantities[gift._id]}</span>
                    <button
                      onClick={() => handleIncrement(gift._id)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftPopup;
