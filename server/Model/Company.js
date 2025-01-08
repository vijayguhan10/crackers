const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyname: {
    type: String,
    required: true
  },
  companytagline: {
    type: String,
    required: true
  },
  salesperson: {
    type: String,
    required: true
  },
  personcontact: {
    type: String,
    required: true
  },
  shopaddress: {
    type: String,
    required: true
  },
  paymentterms: {
    type: String,
    required: true,
    default: 'Due upon receipt'
  },
  jobdescription: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  bankdetails: {
    accountname: {
      type: String,
      required: true
    },
    accountno: {
      type: Number,
      required: true
    },
    accounttype: {
      type: String,
      required: true
    },
    bankname: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    ifsc: {
      type: String,
      required: true
    }
  },
  totalrevenue: {
    type: Number,
    default: 0
  },
  totalinvoices: {
    type: Number,
    default: 0
  },
  totalcustomers: {
    type: Number,
    default: 0
  }
});

module.exports = companySchema;
