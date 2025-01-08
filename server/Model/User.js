const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber: Number,
  role: {
    type: String,
    enum: ['superadmin', 'subadmin'],
    required: true
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  subadmindetails: [
    {
      name: { type: String, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      dbname: { type: String, required: true },
      status: { type: Boolean, default: true }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = userSchema;
