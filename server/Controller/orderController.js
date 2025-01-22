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
        .json({ message: 'Unauthorized to place an order.' });
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
      .select('customer grandtotal createdat');

    const currentDate = new Date();
    const oneYearAgo = new Date(
      currentDate.setFullYear(currentDate.getFullYear() - 1)
    );

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdat: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: { $month: '$createdat' },
          revenue: { $sum: '$grandtotal' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const monthlyRevenueData = Array(12).fill(0);
    monthlyRevenue.forEach(({ _id, revenue }) => {
      monthlyRevenueData[_id - 1] = revenue;
    });

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalInvoices,
      totalCustomers,
      top3Orders,
      monthlyRevenue: monthlyRevenueData
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
};
