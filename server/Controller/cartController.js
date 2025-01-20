const { getCartModel } = require('../utils/dbUtil');

exports.saveCart = async (req, res) => {
  try {
    const { id, products, giftboxes, discount, total, gst, grandtotal } =
      req.body;

    const Cart = getCartModel(req.db);

    // let cart = await Cart.findOne({ customerId });
    // if (cart) {
    //     cart.products = products;
    //     cart.giftboxes = giftboxes;
    //     cart.discount = discount;
    //     cart.total = total;
    //     cart.gst = gst;
    //     cart.grandTotal = grandTotal;

    //     await cart.save();
    //     return res.status(200).json({ message: "Cart updated successfully", cart });
    // } else {

    const newCart = new Cart({
      id,
      products,
      giftboxes,
      discount,
      total,
      gst,
      grandtotal
    });

    await newCart.save();
    return res
      .status(200)
      .json({ message: 'Cart saved successfully', cart: newCart });
    // }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error saving cart', error: error.message });
  }
};

exports.getPendingCart = async (req, res) => {
  try {
    const { id } = req.params;

    const Cart = getCartModel(req.db);
    const cart = await Cart.findOne({ id });

    if (!cart) {
      return res.status(400).json({ message: 'No pending cart found' });
    }

    await Cart.deleteOne({ id });

    return res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error retrieving pending cart', error: error.message });
  }
};
