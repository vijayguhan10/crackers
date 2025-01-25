const { getCompanyModel, getCustomerModel } = require('../utils/dbUtil');

exports.createCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to create a customer.' });
    }

    const db = req.db;
    const Customer = getCustomerModel(db);
    const Company = getCompanyModel(db);

    const company = await Company.findOne();
    if (!company) {
      return res.status(404).json({ message: 'Company details not found' });
    }

    const { name, address, phone } = req.body;
    console.log(name, address, phone);
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res.status(400).json({ message: 'Customer already exists.' });
    }

    customer = new Customer({ name, address, phone });
    await customer.save();

    company.totalcustomers += 1;
    await company.save();

    console.log('saving the customer data : ', customer);
    res
      .status(200)
      .json({ message: 'Customer created successfully.', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res
      .status(500)
      .json({ message: 'Error creating customer', error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to view customer details.' });
    }

    const db = req.db;
    const Customer = getCustomerModel(db);
    const customers = await Customer.find({});

    res.status(200).json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching customers', error: error.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to get customer details.' });
    }

    const db = req.db;
    const Customer = getCustomerModel(db);
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting customer details',
      error: error.message
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

    const db = req.db;
    const Customer = getCustomerModel(db);
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }

    const updateData = req.body;

    delete updateData.id;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Customer updated successfully.',
      customer: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating customer details',
      error: error.message
    });
  }
};

// exports.changeActive = async (req, res) => {
//   try {
//     if (req.user.role !== 'subadmin') {
//       return res
//         .status(401)
//         .json({ message: 'Unauthorized to change customer state.' });
//     }

//     const db = req.db;
//     const Customer = getCustomerModel(db);
//     const { id } = req.body;
//     if (!id) {
//       return res.status(400).json({ message: 'Customer ID is required.' });
//     }

//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res.status(400).json({ message: 'Customer not found.' });
//     }

//     customer.status = !customer.status;
//     await customer.save();

//     res.status(200).json({
//       message: `Customer status changed to ${
//         customer.status ? 'active' : 'inactive'
//       }.`,
//       customer
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'Error changing customer state', error: error.message });
//   }
// };

exports.getCustomersWithOrderDetails = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to view customer details.' });
    }

    const db = req.db;
    const Customer = getCustomerModel(db);

    const customers = await Customer.aggregate([
      {
        $match: { orders: { $exists: true, $ne: [] } }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orders.id',
          foreignField: '_id',
          as: 'orderDetails'
        }
      },
      {
        $unwind: {
          path: '$orderDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          address: 1,
          phone: 1,
          status: 1,
          createdAt: 1,
          'orderDetails.id': 1,
          'orderDetails.createdat': 1,
          'orderDetails.grandtotal': 1,
          'orderDetails.invoicepdf': 1
        }
      },
      {
        $sort: { 'orderDetails.createdat': -1 }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          address: { $first: '$address' },
          phone: { $first: '$phone' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          orders: { $push: '$orderDetails' }
        }
      }
    ]);

    const formattedCustomers = customers.map((customer) => {
      const latestOrder =
        customer.orders.length > 0 ? customer.orders[0] : null;
      const latestOrderDate = latestOrder ? latestOrder.createdat : null;

      return {
        _id: customer._id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        status: customer.status,
        createdAt: customer.createdAt,
        latestOrderDate,
        orders: customer.orders.map((order) => ({
          id: order.id,
          createdat: order.createdat,
          grandtotal: order.grandtotal,
          invoicepdf: order.invoicepdf
        }))
      };
    });

    const sortedCustomers = formattedCustomers.sort((a, b) => {
      const dateA = a.latestOrderDate ? new Date(a.latestOrderDate) : 0;
      const dateB = b.latestOrderDate ? new Date(b.latestOrderDate) : 0;
      return dateB - dateA;
    });

    res.status(200).json(sortedCustomers);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customers with order details',
      error: error.message
    });
  }
};
