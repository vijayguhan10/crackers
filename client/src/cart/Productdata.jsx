import { useState, useEffect } from 'react';
import Endcart from './EndCart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMoneyBill } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import GiftPopup from './GiftPopup';
function App() {
  const [gifts, setGifts] = useState([]);
  const { id, name } = useParams();
  const [SelectedGift, SetSelectedGift] = useState([]);
  console.log('consoling the useparams id : ', id);
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(50);
  const [products, SetProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [PdfUrl, setPdfUrl] = useState('');
  const [isGSTEnabled, setIsGSTEnabled] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18);

  const [editProductId, setEditProductId] = useState(null);
  const [updatedStock, setUpdatedStock] = useState({});

  const handleEdit = (productId, stockavailable) => {
    setEditProductId(productId);
    setUpdatedStock((prev) => ({ ...prev, [productId]: stockavailable }));
  };

  const handleSave = async (product) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('cracker_token');

      const updatedProduct = {
        ...product,
        stockavailable: updatedStock[product._id]
      };

      console.log(
        '😥😥😥 To Update Product : ',
        product,
        'updatedStock : ',
        updatedStock[product._id]
      );

      await axios.patch(
        `${process.env.REACT_APP_BASEURL}/product/update`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Product updated successfully!');
      setEditProductId(null);
      getProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGiftData = async () => {
    try {
      console.log('triggered');
      const token = localStorage.getItem('cracker_token');

      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/giftbox/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setGifts(response.data);
    } catch (error) {
      console.error('Error fetching gift data:', error);
    }
  };

  useEffect(() => {
    fetchGiftData();
  }, []);

  const getProducts = async () => {
    const token = localStorage.getItem('cracker_token');

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/product/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      SetProducts(response.data);
    } catch (error) {
      console.error('Error fetching products: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getcartdata = async () => {
    const token = localStorage.getItem('cracker_token');

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/cart/pending/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const ReturnCart = response.data;
      setDiscount(ReturnCart.discount);
      setIsGSTEnabled(ReturnCart.gst.status);
      setGstPercentage(ReturnCart.gst.percentage);

      const CartProducts = [];
      for (let i = 0; i < response.data.products.length; i++) {
        const cartItem = response.data.products[i];
        console.log('Cart item being processed:', cartItem);
        const product = products.find(
          (product) => String(product._id) === String(cartItem.productId)
        );

        if (product) {
          if (product.stockavailable === 0) {
            toast.error(
              `Product "${product.name}" is out of stock and has been removed from the cart.`
            );
          } else if (cartItem.quantity > product.stockavailable) {
            toast.warning(
              `The quantity of "${product.name}" in the cart has been adjusted to the available stock (${product.stockavailable}).`
            );
            product.quantity = product.stockavailable;
            CartProducts.push(product);
          } else {
            product.quantity = cartItem.quantity;
            CartProducts.push(product);
          }
        } else {
          toast.error(
            `Product with ID "${cartItem.productId}" is no longer available.`
          );
        }
      }

      const GiftProducts = [];
      for (let i = 0; i < response.data.giftboxes.length; i++) {
        const cartItem = response.data.giftboxes[i];
        console.log('Giftbox item being processed:', cartItem);
        const GIFT = gifts.find(
          (gift) => String(gift._id) === String(cartItem.giftBoxId)
        );

        if (GIFT) {
          if (GIFT.stockavailable === 0) {
            toast.error(
              `Gift box "${GIFT.name}" is out of stock and has been removed from the cart.`
            );
          } else if (cartItem.quantity > GIFT.stockavailable) {
            toast.warning(
              `The quantity of gift box "${GIFT.name}" in the cart has been adjusted to the available stock (${GIFT.stockavailable}).`
            );
            GIFT.quantity = GIFT.stockavailable;
            GiftProducts.push(GIFT);
          } else {
            GIFT.quantity = cartItem.quantity;
            GiftProducts.push(GIFT);
          }
        } else {
          toast.error(
            `Gift box with ID "${cartItem.giftBoxId}" is no longer available.`
          );
        }
      }

      setCart(CartProducts);
      SetSelectedGift(GiftProducts);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('No pending cart found for the user. 🤪🤪🤪🤪');
      } else {
        console.error('Error fetching cart data: ', error);
        toast.error('An error occurred while fetching cart data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Updated Cart State:', cart);
  }, [cart]);

  useEffect(() => {
    console.log('Updated Gift State:', SelectedGift);
  }, [SelectedGift]);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && gifts.length > 0) {
      getcartdata();
    }
  }, [products, gifts]);

  const updateCart = (cracker, value) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id === cracker._id) {
          return value > 0 ? { ...item, quantity: value } : null;
        }
        return item;
      })
      .filter((item) => item !== null);

    if (value > 0 && !cart.find((item) => item._id === cracker._id)) {
      updatedCart.push({ ...cracker, quantity: value });
    }

    setCart(updatedCart);
  };

  const incrementQuantity = (cracker) => {
    const item = cart.find((item) => item._id === cracker._id);
    const currentQuantity = item?.quantity || 0;

    if (currentQuantity < cracker.stockavailable) {
      updateCart(cracker, currentQuantity + 1);
    }
  };

  const decrementQuantity = (cracker) => {
    const item = cart.find((item) => item._id === cracker._id);
    const currentQuantity = item?.quantity || 0;

    if (currentQuantity > 0) {
      updateCart(cracker, currentQuantity - 1);
    }
  };

  const removeFromCart = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
  };

  return (
    <div className="ml-[0%] min-h-screen bg-gray-50 sm:ml-[16.7%] overflow-hidden ">
      <div>
        <header className="bg-[#4ADE80] text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="ml-16  flex items-center gap-2">
              <span className="text-2xl">
                <FaMoneyBill color="black" />
              </span>
              <h1 className="text-2xl font-bold text-black">
                Invoice for {name}
              </h1>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
          </div>
        </header>
      </div>
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {showPopup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 ml-[0%] sm:ml-[16.17%]"
            onClick={() => setShowPopup(false)}
          />
        )}
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
              <GiftPopup
                fetchGiftData={fetchGiftData}
                SelectedGifts={SelectedGift}
                setSelectedGifts={SetSelectedGift}
                gifts={gifts}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
              />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto h-[75%] overflow-y-scroll custom-scrollbar">
            <table className="w-full ">
              <thead className="bg-gray-800 sticky top-0 z-10 text-white">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">S.No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Edit</th>
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
                    <tr key={cracker._id} className="border-b">
                      <td className="p-4 text-2xl">{cracker.image}</td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{cracker.name}</td>
                      <td className="p-4">
                        {editProductId === cracker._id ? (
                          <input
                            type="number"
                            value={updatedStock[cracker._id]}
                            onChange={(e) =>
                              setUpdatedStock({
                                ...updatedStock,
                                [cracker._id]: parseInt(e.target.value, 10) || 0
                              })
                            }
                            className="w-20 border rounded text-center"
                          />
                        ) : (
                          cracker.stockavailable
                        )}
                      </td>
                      <td className="p-4">Rs. {cracker.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementQuantity(cracker)}
                            className={`${
                              !cart.find((item) => item._id === cracker._id) ||
                              cart.find((item) => item._id === cracker._id)
                                ?.quantity === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-400 text-white hover:bg-red-600'
                            } px-2 rounded`}
                            disabled={
                              !cart.find((item) => item._id === cracker._id) ||
                              cart.find((item) => item._id === cracker._id)
                                ?.quantity === 0
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={cracker.stockavailable}
                            value={
                              cart.find((item) => item._id === cracker._id)
                                ?.quantity || 0
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10) || 0;
                              if (value > cracker.stockavailable) {
                                toast.error(
                                  `Quantity exceeds the available stock of ${cracker.stockavailable}`
                                );
                              }

                              if (
                                value >= 0 &&
                                value <= cracker.stockavailable
                              ) {
                                updateCart(cracker, value);
                              }
                            }}
                            className={`w-16 border rounded text-center ${
                              cracker.stockavailable === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed '
                                : ''
                            }`}
                            disabled={cracker.stockavailable === 0}
                          />

                          <button
                            onClick={() => incrementQuantity(cracker)}
                            className={`${
                              cracker.stockavailable === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#4ADE80] text-white hover:bg-green-600'
                            } px-2 rounded`}
                            disabled={cracker.stockavailable === 0}
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
                      <td className="p-4">
                        {editProductId === cracker._id ? (
                          <button
                            onClick={() => handleSave(cracker)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleEdit(cracker._id, cracker.stockavailable)
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Endcart
          SetSelectedGift={SetSelectedGift}
          SelectedGift={SelectedGift}
          showPopup={showPopup}
          id={id}
          setPdfUrl={setPdfUrl}
          cart={cart}
          removeFromCart={removeFromCart}
          discount={discount}
          setDiscount={setDiscount}
          setCart={setCart}
          isGSTEnabled={isGSTEnabled}
          setIsGSTEnabled={setIsGSTEnabled}
          gstPercentage={gstPercentage}
          setGstPercentage={setGstPercentage}
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
      <ToastContainer />
    </div>
  );
}

export default App;
