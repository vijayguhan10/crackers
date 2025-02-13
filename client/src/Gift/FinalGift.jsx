import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Wallet } from "lucide-react";

const FinalGift = ({
  giftData,
  cart,
  total,
  removeFromCart,
  setCart,
  filteredProducts,
}) => {
  console.log("filtereddata data in the FinalGift : ", filteredProducts);
  console.log("GiftData data in the FinalGift : 💕💕 ", giftData);

  const [inputGrandTotal, setInputGrandTotal] = useState(0);
  const [isTotalEmpty, setIsTotalEmpty] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isCountEmpty, setIsCountEmpty] = useState(false);
  const [giftBoxName, setGiftBoxName] = useState("");
  const [GiftBoxCount, setGiftBoxCount] = useState("");

  useEffect(() => {
    if (giftData) {
      setGiftBoxName(giftData.name || "");
      setGiftBoxCount(giftData.stockavailable || 0);
      setInputGrandTotal(giftData.grandtotal || 0);
    }
  }, [filteredProducts, cart, giftData]);

  const handleCheckout = async () => {
    if (!filteredProducts.length && !cart.length) {
      toast.error("No products selected!");
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

    const grandTotalValue = Number(inputGrandTotal);
    console.log("👌👌11 : ", grandTotalValue);
    if (isNaN(grandTotalValue) || grandTotalValue <= 0) {
      toast.error("Please enter a valid grand total.");
      return;
    }

    const requestData = {
      name: giftBoxName,
      products: (filteredProducts.length ? filteredProducts : cart).map(
        (product) => ({
          productId: product._id,
          quantity: product?.quantity || 0,
        })
      ),
      total,
      grandtotal: grandTotalValue,
      stockavailable: Number(GiftBoxCount),
    };

    if (giftData) {
      requestData._id = giftData._id; // Include the ID for updating
    }

    console.log("request data :🤣🤣 ", requestData);
    const token = localStorage.getItem("cracker_token");

    try {
      const endpoint = `${process.env.REACT_APP_BASEURL}/giftbox`;
      if (giftData) {
        requestData._id = giftData._id;
      }
      const method = giftData ? "put" : "post";

      const response = await axios[method](endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        toast.success(
          `Gift box ${giftData ? "updated" : "created"} successfully!`
        );
        setCart([]);
        setGiftBoxName("");
        setInputGrandTotal(0);
        setGiftBoxCount("");
      }
    } catch (error) {
      console.error("Error creating/updating gift box:", error);
      toast.error("Failed to create/update gift box. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-2">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
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
                  {(filteredProducts?.length ? filteredProducts : cart).map(
                    (product, index) => (
                      <tr key={product._id} className="border-b text-nowrap">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-8">{product?.quantity || 0}</td>
                        <td className="p-4 text-black">
                          Rs.{" "}
                          {Number(product?.price || 0) *
                            Number(product?.quantity || 0)}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="bg-gray-200 p-1 rounded"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  )}
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
                  value={isNameEmpty ? "" : giftBoxName || giftData?.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGiftBoxName(value);
                    setIsNameEmpty(value === "");
                  }}
                  placeholder="Gift Box Name"
                  className="w-full p-2 border rounded"
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="GiftBoxCount" className="block font-bold mb-2">
                  Enter the Stocks of the GiftBox
                </label>
                <input
                  id="GiftBoxCount"
                  type="number"
                  min={0}
                  value={
                    isCountEmpty
                      ? ""
                      : GiftBoxCount || giftData?.stockavailable || 0
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setGiftBoxCount(value);
                    setIsCountEmpty(value === "");
                  }}
                  placeholder="Enter the Gift box Stocks"
                  className="w-full p-2 border rounded"
                />
              </div>
  
              <div className="flex justify-between items-center xl:w-full">
                <div className="flex items-center w-1/2">
                  <span className="text-gray-700 font-medium">TOTAL:</span>
                  <span className="text-gray-900 font-medium pl-4">
                    Rs. {total}
                  </span>
                </div>
  
                <div className="flex justify items-center">
                  <span className="text-gray-800 font-bold text-sm text-nowrap">
                    GRAND TOTAL:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      id="inputGrandTotal"
                      type="number"
                      value={
                        isTotalEmpty
                          ? ""
                          : inputGrandTotal || giftData?.grandtotal || 0
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setInputGrandTotal(value);
                        setIsTotalEmpty(value === "");
                      }}
                      className="w-24 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
                  {giftData ? `Save Gift Box` : "Create Gift Box"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );  
};

export default FinalGift;
