import { useState, useEffect } from "react";
import Endcart from "./EndCart";
import { FaMoneyBill } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";

function App() {
  const { id } = useParams();
  console.log("consoling the useparams id : ", id);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(50);
  const [products, SetProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [PdfUrl, setPdfUrl] = useState("");

  // Fetching Products from API
  const getProducts = async () => {
    const token = localStorage.getItem("cracker_token");

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/product/active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // Add item to the cart
  const addToCart = (cracker) => {
    const existingItem = cart.find((item) => item._id === cracker._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === cracker._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...cracker, quantity: 1 }]);
    }
  };

  // Update item quantity in the cart
  const updateQuantity = (_id, delta) => {
    setCart(
      cart
        .map((item) =>
          item._id === _id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item from the cart
  const removeFromCart = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
  };

  // Calculate total and grand total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = total * (1 - discount / 100);

  return (
    <div className="min-h-screen bg-gray-50 ml-[16.7%] overflow-hidden">
      <div>
        <header className="bg-[#4ADE80] text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                <FaMoneyBill color="black" />
              </span>
              <h1 className="text-2xl font-bold text-black">
                Invoice for Vijay Guhan
              </h1>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
          </div>
        </header>
      </div>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-full lg:h-[1000px]">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              📝 BILLING
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
            <button className="bg-[#6be196] text-white px-4 py-2 rounded-lg hover:bg-[#4ADE80]">
              + Add Crackers
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto h-[75%] overflow-y-scroll custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-800 sticky top-0 z-10 text-white">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">S.No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total</th>
                </tr>
              </thead>
              <tbody className="text-center items-center">
                {products
                  .filter((cracker) =>
                    cracker.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((cracker, index) => (
                    <tr key={cracker._id} className="border-b ">
                      <td className="p-4 text-2xl">{cracker.image}</td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{cracker.name}</td>
                      <td className="p-4">{cracker.stockavailable}</td>
                      <td className="p-4">Rs. {cracker.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(cracker._id, -1)}
                            className="bg-red-400 text-white px-2 rounded"
                          >
                            -
                          </button>
                          <span>
                            {cart.find((item) => item._id === cracker._id)
                              ?.quantity || 0}
                          </span>
                          <button
                            onClick={() => addToCart(cracker)}
                            className="bg-[#4ADE80] text-white px-2 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        Rs.
                        {(cart.find((item) => item._id === cracker._id)
                          ?.quantity || 0) * cracker.price}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Endcart
          id={id}
          setPdfUrl={setPdfUrl}
          cart={cart}
          total={total}
          grandTotal={grandTotal}
          removeFromCart={removeFromCart}
          discount={discount}
          setDiscount={setDiscount}
          setCart={setCart}
        />
      </div>

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

      {PdfUrl && (
        <div className="mt-6 border-t">
          <h3 className="text-lg font-bold mb-2">Invoice</h3>
          <iframe
            src={PdfUrl}
            title="Invoice PDF"
            className="w-full h-[1000px] border rounded-lg"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
