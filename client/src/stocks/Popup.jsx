import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Popup = ({ newCracker, setNewCracker, getProducts, setShowModal }) => {
  return (
    <div>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">Add Cracker</h3>
          <input
            type="text"
            placeholder="Name"
            value={newCracker.name}
            onChange={(e) =>
              setNewCracker({ ...newCracker, name: e.target.value })
            }
            className="w-full p-2 border mb-4"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newCracker.stockavailable}
            onChange={(e) =>
              setNewCracker({ ...newCracker, stockavailable: e.target.value })
            }
            className="w-full p-2 border mb-4"
          />
          <input
            type="number"
            placeholder="Price"
            value={newCracker.price}
            onChange={(e) =>
              setNewCracker({ ...newCracker, price: e.target.value })
            }
            className="w-full p-2 border mb-4"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                const token = localStorage.getItem("cracker_token");
                try {
                  await axios.post(
                    `${process.env.REACT_APP_BASEURL}/product/add`,
                    newCracker,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  toast.success("Cracker added!");
                  getProducts();
                  setShowModal(false);
                } catch (error) {
                  toast.error("Failed to add cracker");
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
