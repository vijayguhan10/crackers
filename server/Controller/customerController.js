// const mongoose = require('mongoose');
// const orderSchema = require('../Model/Order');
// const customerSchema = require('../Model/Customer');

// const getDatabaseConnection = async (dblink) => {
//   if (!dblink) {
//     throw new Error('Database link not provided');
//   }
//   try {
//     const db = await mongoose.createConnection(dblink);
//     return db;
//   } catch (error) {
//     throw new Error('Failed to connect to the database');
//   }
// };

// const getOrderModel = (db) => db.model('Order', orderSchema);
// const getCustomerModel = (db) => db.model('Customer', customerSchema);

// exports.findCustomerByPhone = async (req, res) => {
//   try {
//     if (req.user.role !== 'subadmin') {
//       return res
//         .status(403)
//         .json({ message: 'Unauthorized for viewing Customer Details.' });
//     }

//     const db = await getDatabaseConnection(req.user?.dblink);
//     const Customer = getCustomerModel(db);
//     const Order = getOrderModel(db);

//     const { phone } = req.params;

//     if (!phone) {
//       return res.status(400).json({ message: 'Phone number is required' });
//     }

//     const customer = await Customer.findOne({ phone });

//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     const orders = await Order.find({ customer: customer._id });

//     // if (!orders.length) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: 'No orders found for this customer' });
//     // }

//     res.status(200).json({
//       customer: {
//         name: customer.name,
//         phone: customer.phone,
//         address: customer.address
//       },
//       orders
//     });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res
//       .status(500)
//       .json({ message: 'Error fetching orders', error: error.message });
//   }
// };

// exports.getAllCustomers = async (req, res) => {
//   try {
//     if (req.user.role !== 'subadmin') {
//       return res
//         .status(403)
//         .json({ message: 'Unauthorized for viewing Customer Details.' });
//     }

//     const db = await getDatabaseConnection(req.user?.dblink);
//     const Customer = getCustomerModel(db);
//     const customers = await Customer.find({}, 'name address phone');
//     if (!customers.length) {
//       return res.status(404).json({ message: 'No customers for the Shop' });
//     }
//     return res.status(200).json(customers);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res
//       .status(500)
//       .json({ message: 'Error fetching orders', error: error.message });
//   }
// };


const mongoose = require('mongoose');
const orderSchema = require('../Model/Order');
const customerSchema = require('../Model/Customer');

const getOrderModel = (db) => db.model('Order', orderSchema);
const getCustomerModel = (db) => db.model('Customer', customerSchema);

exports.findCustomerByPhone = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized for viewing Customer Details.' });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection not found.' });
    }

    const Customer = getCustomerModel(db);
    const Order = getOrderModel(db);

    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orders = await Order.find({ customer: customer._id });

    res.status(200).json({
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      },
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res
      .status(500)
      .json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized for viewing Customer Details.' });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection not found.' });
    }

    const Customer = getCustomerModel(db);
    const customers = await Customer.find({}, 'name address phone');
    if (!customers.length) {
      return res.status(404).json({ message: 'No customers for the Shop' });
    }

    return res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res
      .status(500)
      .json({ message: 'Error fetching customers', error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized to create a customer.' });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection not found.' });
    }

    const Customer = getCustomerModel(db);

    const { name, address, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res.status(400).json({ message: 'Customer already exists.' });
    }

    customer = new Customer({ name, address, phone });
    await customer.save();

    res.status(201).json({ message: 'Customer created successfully.', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(500)
      .json({ message: 'Error creating customer', error: error.message });
  }
};
