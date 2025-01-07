const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  cartitems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      unitprice: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true },
      additionalproducts: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
          },
          unitprice: { type: Number, required: true },
          quantity: { type: Number, required: true },
          total: { type: Number, required: true }
        }
      ]
    }
  ],
  overallsum: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, required: true },
  cumulativeamount: { type: Number, required: true },
  invoicepdf: { type: String },
  createdat: { type: Date, default: Date.now }
});

module.exports = orderSchema;
