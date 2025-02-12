import React from "react";
import Products from "./Products";

const EditPopup = ({ gift, onClose }) => {
  console.log("Passed the necessary gift for edit:", gift);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-[90%] md:w-[80%] h-[90%] max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Edit Gift</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Products giftData={gift} />
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
