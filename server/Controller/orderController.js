const { generatePDF } = require('../utils/GenerateInvoice');
const { uploadPDFToCloudinary } = require('../utils/uploadPdf');
const {
  getCartModel,
  getCompanyModel,
  getCustomerModel,
  getGiftBoxModel,
  getOrderModel,
  getProductModel
} = require('../utils/dbUtil');

exports.placeOrder = async (req, res) => {
  const session = await req.db.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to place an order.' });
    }

    const db = req.db;
    const Order = getOrderModel(db);
    const Customer = getCustomerModel(db);
    const Company = getCompanyModel(db);
    const Product = getProductModel(db);
    const GiftBox = getGiftBoxModel(db);
    const Cart = getCartModel(db);

    const company = await Company.findOne().session(session);
    if (!company) {
      throw new Error('Company details not found');
    }

    const { id, products, giftboxes, discount, total, grandtotal, gst } =
      req.body;

    const customer = await Customer.findById(id).session(session);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartItems = [];

    for (const item of products) {
      const { productId, quantity } = item;

      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      if (product.stockavailable < quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = quantity * product.price;
      product.stockavailable -= quantity;
      product.totalsales += quantity;
      product.totalrevenue += itemTotal;
      await product.save({ session });

      cartItems.push({
        id: product._id,
        name: product.name,
        unitprice: product.price,
        quantity: quantity,
        total: itemTotal
      });
    }
    if (giftboxes) {
      for (const box of giftboxes) {
        const { giftBoxId, quantity } = box;

        const giftBox = await GiftBox.findById(giftBoxId).session(session);
        if (!giftBox) {
          throw new Error(`GiftBox not found: ${giftBoxId}`);
        }

        if (giftBox.stockavailable < quantity) {
          throw new Error(`Insufficient stock for gift box: ${giftBox.name}`);
        }

        const boxTotal = quantity * giftBox.grandtotal;
        giftBox.stockavailable -= quantity;
        giftBox.totalsales += quantity;
        giftBox.totalrevenue += boxTotal;
        await giftBox.save({ session });

        cartItems.push({
          id: giftBox._id,
          name: giftBox.name,
          unitprice: giftBox.grandtotal,
          quantity: quantity,
          total: boxTotal
        });
      }
    }

    const order = new Order({
      customer: customer._id,
      cartitems: products,
      giftBoxes: giftboxes,
      discount: discount,
      total: total,
      grandtotal: grandtotal,
      gst: {
        status: gst.status,
        percentage: gst.status ? gst.percentage : null,
        amount: gst.status ? gst.amount : null
      }
    });

    const savedOrder = await order.save({ session });

    customer.orders.push({
      id: savedOrder._id
      // grandtotal: grandtotal,
      // createdat: new Date()
    });
    await customer.save({ session });

    const orderDetails = {
      cartitems: cartItems,
      discount: order.discount,
      total: order.total,
      grandtotal: order.grandtotal,
      gst: order.gst,
      createdat: order.createdat
    };

    const pdfParams = {
      companyDetails: company,
      customerDetails: customer,
      orderDetails
    };

    try {
      await generatePDF(pdfParams);

      const url = await uploadPDFToCloudinary(
        './invoice.pdf',
        company.name,
        customer.name
      );

      savedOrder.invoicepdf = url;
      await savedOrder.save({ session });

      await session.commitTransaction();
      await Cart.deleteOne({ id });
      res.status(200).json({
        message: 'Order placed successfully and PDF generated',
        invoiceurl: savedOrder.invoicepdf
      });
    } catch (error) {
      throw new Error('Failed to generate or upload the invoice PDF.');
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('Error placing order:', error);
    res
      .status(500)
      .json({ message: 'Error placing order', error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to access dashboard stats.' });
    }

    const db = req.db;
    const Order = getOrderModel(db);
    const Customer = getCustomerModel(db);

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$grandtotal' } } }
    ]);

    const totalInvoices = await Order.countDocuments();

    const totalCustomers = await Customer.countDocuments();

    const top3Orders = await Order.find()
      .sort({ createdat: -1 })
      .limit(3)
      .populate('customer', 'name')
      .select('_id createdat customer grandtotal invoicepdf');

    const formattedTop3Orders = top3Orders.map((order) => ({
      id: order._id,
      date: order.createdat,
      customerName: order.customer.name,
      amount: order.grandtotal,
      invoiceLink: order.invoicepdf
    }));

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const yearlyMonthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdat: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$createdat' } },
          revenue: { $sum: '$grandtotal' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    const monthlyRevenueData = Array(12).fill(0);
    yearlyMonthlyRevenue.forEach(({ _id, revenue }) => {
      monthlyRevenueData[_id.month - 1] = revenue;
    });

    const currentMonthRevenue = monthlyRevenueData[currentMonth - 1];

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalInvoices,
      totalCustomers,
      currentMonthRevenue,
      topOrders: formattedTop3Orders,
      monthlyRevenue: monthlyRevenueData
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
};

exports.getOrdersByMonth = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res.status(401).json({
        error: 'Unauthorized',
        details: 'Only subadmin can access this route'
      });
    }

    const db = req.db;
    const Order = getOrderModel(db); // Order model
    const { year } = req.body;
    console.log();
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          createdat: {
            $gte: new Date(`${parseInt(year)}-01-01`),
            $lt: new Date(`${parseInt(year) + 1}-01-01`)
          }
        }
      },
      {
        $lookup: {
          from: 'customers', // Name of the Customer collection
          localField: 'customer', // Field in Order collection
          foreignField: '_id', // Field in Customer collection
          as: 'customerDetails' // Field to store customer details
        }
      },
      {
        $unwind: '$customerDetails' // Flatten customerDetails array
      },
      {
        $project: {
          _id: 1,
          createdat: 1,
          grandtotal: 1, // Assuming there's a grand total field in the order
          'customerDetails.name': 1, // Include customer name
          invoicepdf: 1, // Invoice link
          month: { $month: '$createdat' } // Extract month from createdat
        }
      },
      {
        $group: {
          _id: '$month', // Group by month
          orders: {
            $push: {
              id: '$_id',
              name: '$customerDetails.name',
              grandTotal: '$grandtotal',
              purchaseDate: '$createdat',
              invoiceLink: '$invoicepdf'
            }
          }
        }
      },
      {
        $sort: { _id: 1 } // Sort by month (ascending)
      }
    ]);

    const formattedResult = Array.from({ length: 12 }, (_, i) => {
      const monthData = ordersByMonth.find((m) => m._id === i + 1);
      return monthData ? monthData.orders : []; // Return empty array if no orders for the month
    });

    res.status(200).json(formattedResult);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
};
