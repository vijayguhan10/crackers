const mongoose = require('mongoose');
const orderSchema = require('../Model/Order');
const customerSchema = require('../Model/Customer');
const productSchema = require('../Model/Product');
const companySchema = require('../Model/Company');
const giftBoxSchema = require('../Model/GiftBox');
const userSchema = require('../Model/User');
const cartSchema = require('../Model/Cart');

const connectionCache = {};

exports.getDatabaseConnection = (databaseName) => {
  if (connectionCache[databaseName]) {
    if (connectionCache[databaseName].readyState === 1) {
      console.log('Reusing the existing conneciton');
      return connectionCache[databaseName];
    } else {
      console.log('Creating the new Connection');
      delete connectionCache[databaseName];
    }
  }
  const dbLink = process.env.DATABASE.replace('<DATABASE>', databaseName);
  const connection = mongoose.createConnection(dbLink);

  connection.on('disconnected', () => {
    console.log(`Connection to ${databaseName} lost. Reconnecting...`);
    connectionCache[databaseName] = mongoose.createConnection(dbLink);
  });

  connectionCache[databaseName] = connection;

  return connection;
};

exports.getOrderModel = (db) => db.model('Order', orderSchema);
exports.getCustomerModel = (db) => db.model('Customer', customerSchema);
exports.getProductModel = (db) => db.model('Product', productSchema);
exports.getCompanyModel = (db) => db.model('Company', companySchema);
exports.getGiftBoxModel = (db) => db.model('GiftBox', giftBoxSchema);
exports.getUserModel = (db) => db.model('User', userSchema);
exports.getCartModel = (db) => db.model('Cart', cartSchema);
