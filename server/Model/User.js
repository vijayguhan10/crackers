const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
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
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      dbname: { type: String, required: true },
      active: { type: Boolean, default: true }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = userSchema;
