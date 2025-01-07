const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Invalid phone number']
  },
  orders: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      invoicepdf: { type: String }
    }
  ]
});

module.exports = customerSchema;
