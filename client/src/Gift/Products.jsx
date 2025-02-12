import { useState, useEffect } from "react";
import { FaMoneyBill } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import FinalGift from "./FinalGift";

function App({ giftData }) {
  console.log("passed the data from the Editpopup to Products  : ", giftData);
  const { id } = useParams();
  console.log("consoling the useparams id : ", id);
  const [cart, setCart] = useState([]);
  const [FilteredProducts, SetfilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, SetProducts] = useState([]);
  const [Loading, setLoading] = useState(false);

  const getProducts = async () => {
    const token = localStorage.getItem("cracker_token");

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/product/active`,
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

  useEffect(() => {
    if (products.length > 0 && giftData?.products) {
      const filteredProducts = products
        .filter((product) =>
          giftData.products.some(
            (giftProduct) => giftProduct.productId === product._id
          )
        )
        .map((product) => {
          const giftProduct = giftData.products.find(
            (gift) => gift.productId === product._id
          );
          return {
            ...product,
            quantity: giftProduct?.quantity || 0,
          };
        });
      console.log(
        "Filtered products inside gift box:😊😊😊 ",
        filteredProducts
      );
      SetfilteredProducts(filteredProducts);
    }
  }, [products, giftData]);

  const addToCart = (cracker) => {
    let currentData = cart;
    let setCurrentData = setCart;

    if (giftData) {
      currentData = FilteredProducts;
      setCurrentData = SetfilteredProducts;
    }

    const existingItem = currentData.find((item) => item._id === cracker._id);
    if (existingItem) {
      setCurrentData(
        currentData.map((item) =>
          item._id === cracker._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCurrentData([...currentData, { ...cracker, quantity: 1 }]);
    }
  };

  const updateQuantity = (_id, delta) => {
    let currentData = cart;
    let setCurrentData = setCart;

    if (giftData) {
      currentData = FilteredProducts;
      setCurrentData = SetfilteredProducts;
    }

    setCurrentData(
      currentData
        .map((item) =>
          item._id === _id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (_id) => {
    let currentData = cart;
    let setCurrentData = setCart;

    if (giftData) {
      currentData = FilteredProducts;
      setCurrentData = SetfilteredProducts;
    }

    setCurrentData(currentData.filter((item) => item._id !== _id));
  };

  // Calculate total and grand total
  const total = (giftData ? FilteredProducts : cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const grandTotal = total;

  // Merge products with cart/FilteredProducts to get quantities
  const mergedProducts = products.map((product) => {
    const cartItem = cart.find((item) => item._id === product._id);
    const filteredItem = FilteredProducts.find((item) => item._id === product._id);

    // Use quantity from cart or FilteredProducts (based on giftData)
    const quantity = giftData
      ? filteredItem?.quantity || 0
      : cartItem?.quantity || 0;

    return {
      ...product,
      quantity,
      total: product.price * quantity,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-full lg:h-[1000px]">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              📝Add Gifts
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
          </div>

          <div className="bg-white rounded-lg shadow overflow-auto h-[450px] sm:h-[600px] custom-scrollbar">
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
                {mergedProducts
                  .filter((cracker) =>
                    cracker.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((cracker, index) => (
                    <tr key={cracker._id} className="border-b">
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
                          <span>{cracker.quantity}</span>
                          <button
                            onClick={() => addToCart(cracker)}
                            className="bg-[#4ADE80] text-white px-2 rounded"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">Rs. {cracker.total}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
        <FinalGift
          giftData={giftData}
          filteredProducts={FilteredProducts}
          cart={cart}
          total={total}
          grandTotal={grandTotal}
          removeFromCart={removeFromCart}
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
    </div>
  );
}

export default App;