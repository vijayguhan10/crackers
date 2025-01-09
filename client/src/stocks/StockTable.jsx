import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import Popup from "./Popup";
function StockTable() {
  const [showModal, setShowModal] = useState(false);
  const [newCracker, setNewCracker] = useState({
    name: "",
    stockavailable: "",
    price: "",
  });
  const [editCracker, setEditCracker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [Products, SetProducts] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);

  const getProducts = async () => {
    const token = localStorage.getItem("cracker_token");

    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/product/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched products: ", response.data);
      SetProducts(response.data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("cracker_token");

    try {
      setFileLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/product/bulkadd",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Data imported successfully!");
        getProducts();
      }
    } catch (error) {
      toast.error("Failed to import data!");
    } finally {
      setFileLoading(false);
      event.target.value = "";
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCracker((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("editing the crackers data :", editCracker);
  };
  const handleUpdate = async (crackerId) => {
    const token = localStorage.getItem("cracker_token");

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/product/update`,
        editCracker,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        getProducts();
        setEditCracker(null);
      }
    } catch (error) {
      toast.error("Failed to update product!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-[16.7%]">
      <header className="bg-[#4ADE80] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎆</span>
            <h1 className="text-2xl font-bold text-black">AVANTIKA CRACKERS</h1>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
        </div>
      </header>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-full">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              📝 Stocks
            </h2>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 rounded-lg bg-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80]"
              onClick={() => setShowModal(true)}
            >
              + Add Crackers
            </button>
            <div>
              <label
                htmlFor="file-upload"
                className="bg-[#6be196] text-black px-4 py-2 rounded-lg cursor-pointer"
              >
                Import Bulk Data
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {loading || fileLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader size={30} className="animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow h-[90%] overflow-y-scroll custom-scrollbar">
              <table className="w-full border border-gray-800">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-center border border-gray-800">
                      Image
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      S.No
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Name
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Stock
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Price
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Total Sales
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Status
                    </th>
                    <th className="p-4 text-center border border-gray-800">
                      Update Product
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Products.map((cracker, index) => (
                    <tr key={cracker._id} className="border border-gray-800">
                      <td className="p-4 text-center border border-gray-800">
                        <img
                          src={cracker.image}
                          alt={cracker.name}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="p-4 text-center border border-gray-800">
                        {index + 1}
                      </td>
                      <td className="p-4 text-center border border-gray-800">
                        {editCracker && editCracker._id === cracker._id ? (
                          <input
                            type="text"
                            name="name"
                            value={editCracker.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-400"
                          />
                        ) : (
                          cracker.name
                        )}
                      </td>
                      <td className="p-4 text-center border border-gray-800">
                        {editCracker && editCracker._id === cracker._id ? (
                          <input
                            type="number"
                            name="stockavailable"
                            value={editCracker.stockavailable}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-400"
                          />
                        ) : (
                          cracker.stockavailable
                        )}
                      </td>
                      <td className="p-4 text-center border border-gray-800">
                        {editCracker && editCracker._id === cracker._id ? (
                          <input
                            type="number"
                            name="price"
                            value={editCracker.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-400"
                          />
                        ) : (
                          `Rs. ${cracker.price}`
                        )}
                      </td>

                      <td className="p-4 text-center border text-red-500 border-gray-800">
                        {cracker.totalsales}
                      </td>
                      <td className="p-4 text-center border text-red-500 border-gray-800">
                        {editCracker && editCracker._id === cracker._id ? (
                          <select
                            value={editCracker.status}
                            onChange={handleChange}
                            name="status"
                            className="p-2 border rounded-lg"
                          >
                            <option value="none">status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        ) : (
                          <span>
                            {cracker.status === true ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="items-center flex justify-center mt-4">
                        {editCracker && editCracker._id === cracker._id ? (
                          <button
                            onClick={() => handleUpdate(cracker._id)}
                            className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80]"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditCracker(cracker)}
                            className="bg-[#6be196] text-black px-4 py-2 rounded-lg hover:bg-[#4ADE80]"
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Popup
          newCracker={newCracker}
          setNewCracker={setNewCracker}
          getProducts={getProducts}
          setShowModal={setShowModal}
        />
      )}
      <ToastContainer />

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
export default StockTable;
