const { getCartModel } = require('../utils/dbUtil');
const mongoose = require('mongoose');
exports.saveCart = async (req, res) => {
  try {
    const { id, products, giftboxes, discount, total, gst, grandtotal } =
      req.body;

    const Cart = getCartModel(req.db);

    const isCartEmpty = products.length === 0 && giftboxes.length === 0;

    let cart = await Cart.findOne({ id });

    if (isCartEmpty) {
      if (cart) {
        await Cart.deleteOne({ id });
        return res
          .status(201)
          .json({ message: 'Cart deleted successfully as it is empty' });
      } else {
        return res
          .status(200)
          .json({ message: 'No action required, cart is already empty' });
      }
    } else {
      if (cart) {
        cart.products = products;
        cart.giftboxes = giftboxes;
        cart.discount = discount;
        cart.total = total;
        cart.gst = gst;
        cart.grandtotal = grandtotal;

        await cart.save();
        return res
          .status(201)
          .json({ message: 'Cart updated successfully', cart });
      } else {
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
          .status(201)
          .json({ message: 'Cart saved successfully', cart: newCart });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error saving cart', error: error.message });
  }
};

exports.getPendingCart = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('consoling the id : ', id);
    const Cart = getCartModel(req.db);
    const cart = await Cart.findOne({ id });
    console.log('cart data  : ', cart);
    if (!cart) {
      return res.status(400).json({ message: 'No pending cart found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error retrieving pending cart', error: error.message });
  }
};
