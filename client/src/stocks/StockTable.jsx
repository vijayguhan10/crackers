import { useState } from "react";
function StockTable() {
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
            <button className="bg-[#6be196] text-white px-4 py-2 rounded-lg hover:bg-[#4ADE80]">
              + Add Crackers
            </button>
          </div>

          <div className="bg-white rounded-lg shadow h-[46%] overflow-y-scroll custom-scrollbar">
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
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {crackers.map((cracker) => (
                  <tr key={cracker.id} className="border border-gray-800">
                    <td className="p-4 text-center border border-gray-800">
                      {cracker.image}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      {cracker.id}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      {cracker.name}
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      <input
                        type="number"
                        value={cracker.stock}
                        onChange={(e) =>
                          console.log(
                            `New stock value for ${cracker.name}:`,
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-400"
                      />
                    </td>
                    <td className="p-4 text-center border border-gray-800">
                      Rs. {cracker.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </div>
    </div>
  );
}

export default StockTable;
