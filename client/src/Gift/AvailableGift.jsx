import React, { useState } from "react";

const AvailableGift = () => {
  const [giftBoxes, setGiftBoxes] = useState([
    {
      id: 1,
      name: "Diwali Delight Box",
      totalSales: 20,
      total: 200000,
    },
    {
      id: 2,
      name: "Festival Fiesta Pack",
      totalSales: 15,
      total: 150000,
    },
    {
      id: 3,
      name: "Cracker Carnival Box",
      totalSales: 18,
      total: 180000,
    },
  ]);

  const handleEdit = (id) => {
    alert(`Edit Gift Box with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm) {
      setGiftBoxes((prev) => prev.filter((giftBox) => giftBox.id !== id));
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-start mb-6 text-gray-800">
          Gift Box Management
        </h1>
        {giftBoxes.map((giftBox) => (
          <GiftBoxCard
            key={giftBox.id}
            giftBox={giftBox}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

const GiftBoxCard = ({ giftBox, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-white border border-black  p-4 mb-6 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{giftBox.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(giftBox.id)}
            className="bg-blue-500 text-white px-3 py-1  hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(giftBox.id)}
            className="bg-red-500 text-white px-3 py-1  hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={toggleDetails}
            className={`${
              isOpen ? "bg-gray-400" : "bg-green-500"
            } text-white px-3 py-1  hover:${
              isOpen ? "bg-gray-500" : "bg-green-600"
            }`}
          >
            {isOpen ? "Close" : "Open"}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 border-t pt-4">
          <p className="text-gray-700">
            <span className="font-semibold">Total Sales:</span>{" "}
            {giftBox.totalSales}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total:</span> ₹{giftBox.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableGift;
