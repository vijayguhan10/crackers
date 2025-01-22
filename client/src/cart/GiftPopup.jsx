// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const GiftPopup = ({
//   SetSelectedGift,
//   showPopup,
//   setShowPopup,
//   quantities,
//   setQuantities,
//   gifts,
//   setGifts,
// }) => {
//   const handleIncrement = (id) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [id]: prev[id] + 1,
//     }));
//   };

//   const handleDecrement = (id) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [id]: Math.max(prev[id] - 1, 0),
//     }));
//   };

//   const handleSave = () => {
//     const selectedGifts = gifts
//       .filter((gift) => quantities[gift._id] > 0)
//       .map((gift) => ({
//         _id: gift._id,
//         name: gift.name,
//         grandtotal: gift.grandtotal,
//         quantity: quantities[gift._id],
//       }));
//     SetSelectedGift(selectedGifts);
//     console.log("Selected Gifts:", selectedGifts);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center ">
//       <button
//         onClick={() => setShowPopup(true)}
//         className="px-4 py-2 text-black rounded shadow"
//       >
//         Open Gift Popup
//       </button>
//       {showPopup && (
//         <div className="fixed inset-0 text-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[50%] p-6 relative">
//             <button
//               onClick={() => setShowPopup(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//             >
//               ✖
//             </button>

//             <h2 className="text-xl font-bold mb-4 text-center">Gift Items</h2>

//             <table className="w-full border-collapse border border-gray-300 text-center">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2">Name</th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Stock Available
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     Grand Total
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2">Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {gifts.map((gift) => (
//                   <tr key={gift._id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 px-4 py-2">
//                       {gift.name}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {gift.stockavailable}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {gift.grandtotal}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       <div className="flex items-center justify-center space-x-2">
//                         <button
//                           onClick={() => handleDecrement(gift._id)}
//                           className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                         >
//                           -
//                         </button>
//                         <span className="px-4">{quantities[gift._id]}</span>
//                         <button
//                           onClick={() => handleIncrement(gift._id)}
//                           className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-4 text-right">
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save Selected Gifts
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default  GiftPopup ;

import React, { useState } from "react";
import axios from "axios";

const GiftPopup = ({
  SelectedGifts,
  setSelectedGifts,
  showPopup,
  setShowPopup,
  gifts,
}) => {
  const addToGift = (gift) => {
    const existingGift = SelectedGifts.find((item) => item._id === gift._id);
    if (existingGift) {
      setSelectedGifts(
        SelectedGifts.map((item) =>
          item._id === gift._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedGifts([...SelectedGifts, { ...gift, quantity: 1 }]);
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
                </tr>
              </thead>
              <tbody>
                {gifts.map((gift) => (
                  <tr key={gift._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {gift.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {gift.stockavailable}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {gift.grandtotal}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateQuantity(gift._id, -1)}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="px-4">
                          {SelectedGifts.find((item) => item._id === gift._id)
                            ?.quantity || 0}
                        </span>
                        <button
                          onClick={() => addToGift(gift)}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <div className="mt-4 text-right">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Selected Gifts
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftPopup;
