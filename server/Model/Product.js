const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  stockavailable: {
    type: Number,
    required: true
  },
  totalsales: {
    type: Number,
    default: 0
  },
  totalrevenue: {
    type: Number,
    default: 0.0
  },
  // optionalproduct: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Product'
  //   }
  // ],
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = productSchema;
