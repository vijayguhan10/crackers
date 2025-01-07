import { useState } from "react";
import FinalGift from "./FinalGift";
import Header from "../components/Header";
import { Gift } from "lucide-react";
function GiftProducts() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(50);

  const crackers = [
    { id: "187499", name: "Cracker 1", stock: 1000, price: 100, image: "🎁" },
    { id: "187456", name: "Cracker 2", stock: 1000, price: 250, image: "🎆" },
    { id: "187442", name: "Cracker 3", stock: 1000, price: 345, image: "🧨" },
    { id: "187477", name: "Cracker 4", stock: 1000, price: 50, image: "🚀" },
    { id: "187441", name: "Cracker 5", stock: 1000, price: 25, image: "🎁" },
    { id: "187456", name: "Cracker 6", stock: 1000, price: 550, image: "🎆" },
  ];

  const addToCart = (cracker) => {
    const existingItem = cart.find((item) => item.id === cracker.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === cracker.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...cracker, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = total * (1 - discount / 100);

  return (
    <div className=" bg-gray-50 ">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gift /> Add Gifts
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

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
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
              <tbody>
                {crackers.map((cracker) => (
                  <tr key={cracker.id} className="border-b">
                    <td className="p-4 text-2xl">{cracker.image}</td>
                    <td className="p-4">{cracker.id}</td>
                    <td className="p-4">{cracker.name}</td>
                    <td className="p-4">{cracker.stock}</td>
                    <td className="p-4">Rs. {cracker.price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(cracker.id, -1)}
                          className="bg-red-400 text-white px-2 rounded"
                        >
                          -
                        </button>
                        <span>
                          {cart.find((item) => item.id === cracker.id)
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
                      Rs.{" "}
                      {(cart.find((item) => item.id === cracker.id)?.quantity ||
                        0) * cracker.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <FinalGift
          cart={cart}
          total={total}
          grandTotal={grandTotal}
          removeFromCart={removeFromCart}
          discount={discount}
          setDiscount={setDiscount}
          setCart={setCart}
        />
      </div>
    </div>
  );
}

export default GiftProducts;
