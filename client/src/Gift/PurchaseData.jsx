import React, { useEffect, useState } from "react";
import {
  User,
  ArchiveRestore,
  Package,
  ShoppingCartIcon,
  Edit,
  Trash,
} from "lucide-react";
import axios from "axios";
import EditPopup from "./EditPopup";

const PurchaseData = () => {
  const [isEdit, setIsEdit] = useState(false); 
  const [Loading, setLoading] = useState(false);
  const [GiftBox, setGiftBox] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null); 

  const getAllGiftBoxes = async () => {
    const token = localStorage.getItem("cracker_token");

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/giftbox`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGiftBox(response.data);
      console.log("fetched gift data : ", response.data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGiftBoxes();
  }, []);

  const handleDelete = async (id, status) => {
    const data = {
      _id: id,
      status: !status,
    };
    console.log("status : ", status);
    const token = localStorage.getItem("cracker_token");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL}/giftbox`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      getAllGiftBoxes();
    } catch (error) {
      console.error("Error deleting gift box: ", error);
    }
  };

  return (
    <div className="mx-4 p-4">
      <h1 className="text-4xl mt-3 mb-3 text-center">Gift Sales Record</h1>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {GiftBox.map((gift) => (
          <div
            key={gift._id}
            className={`flex flex-col rounded-lg border-black border p-6 overflow-hidden ${
              gift.status ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="mb-4 flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 flex items-center">
                      <User size={16} color="green" />
                      <span className="pl-2 font-extrabold text-xl xl:text-2xl lg:text-sm text-nowrap">
                        {gift.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    <Edit
                      className="cursor-pointer mr-2"
                      onClick={() => {
                        setSelectedGift(gift);
                        setIsEdit(true);
                      }}
                    />
                    {gift.status ? (
                      <Trash
                        className="cursor-pointer"
                        onClick={() => handleDelete(gift._id, gift.status)}
                      />
                    ) : (
                      <ArchiveRestore
                        className="cursor-pointer"
                        onClick={() => handleDelete(gift._id, gift.status)}
                      />
                    )}
                  </div>
                </div>
  
                <p className="text-gray-600 flex text-xl xl:text-lg lg:text-sm text-nowrap">
                  <Package size={16} color="green" />
                  <span className="pl-2 lg:text-md">{gift.totalsales}</span>
                </p>
                <p className="text-xl xl:text-lg lg:text-sm text-nowrap text-gray-600 flex">
                  <ShoppingCartIcon size={16} color="green" />
                  <span className="pl-2 lg:text-md">{gift.stockavailable}</span>
                </p>
              </div>
              <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-blue-600">
                  ₹{gift.grandtotal.toLocaleString()}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isEdit && (
        <EditPopup gift={selectedGift} onClose={() => setIsEdit(false)} />
      )}
    </div>
  );  
};

export default PurchaseData;