const mongoose = require('mongoose');
const orderSchema = require('../Model/Order');
const customerSchema = require('../Model/Customer');
const productSchema = require('../Model/Product');
const companySchema = require('../Model/Company');
const { generatePDF } = require('../utils/GenerateInvoice');
const { uploadPDFToCloudinary } = require('../utils/uploadPdf');

const getOrderModel = (db) => db.model('Order', orderSchema);
const getCustomerModel = (db) => db.model('Customer', customerSchema);
const getProductModel = (db) => db.model('Product', productSchema);
const getCompanyModel = (db) => db.model('Company', companySchema);

exports.placeOrder = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(400)
        .json({ message: 'Unauthorized to place an order.' });
    }

    const db = req.db;
    const Order = getOrderModel(db);
    const Customer = getCustomerModel(db);
    const Company = getCompanyModel(db);
    const Product = getProductModel(db);

    const company = await Company.findOne();
    if (!company) {
      return res.status(404).json({ message: 'Company details not found' });
    }

    const { id, products, discount, total, grandtotal, gst } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const cartItems = [];

    for (const item of products) {
      const { productId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${productId}` });
      }

      if (product.stockavailable < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`
        });
      }

      const itemTotal = quantity * product.price;
      product.stockavailable -= quantity;
      product.totalsales += quantity;
      product.totalrevenue += itemTotal;
      await product.save();

      cartItems.push({
        id: product._id,
        image: product.image,
        name: product.name,
        unitprice: product.price,
        quantity: quantity,
        total: itemTotal
      });
    }

    const order = new Order({
      customer: customer._id,
      cartitems: products,
      discount: discount,
      total: total,
      grandtotal: grandtotal,
      gst: {
        status: gst.status,
        percentage: gst.status ? gst.percentage : null,
        amount: gst.status ? gst.amount : null
      }
    });

    const savedOrder = await order.save();
    // console.log(savedOrder);

    customer.orders.push({
      id: savedOrder._id,
      grandtotal: grandtotal
    });
    await customer.save();

    const orderDetails = {
      cartitems: cartItems,
      discount: order.discount,
      total: order.total,
      grandtotal: order.grandtotal,
      gst: order.gst
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
      await savedOrder.save();

      customer.orders.find((o) => o.id.equals(savedOrder._id)).invoicepdf = url;
      await customer.save();

      res.status(200).json({
        message: 'Order placed successfully and PDF generated',
        invoiceurl: savedOrder.invoicepdf
      });
    } catch (error) {
      throw new Error('Failed to generate or upload the invoice PDF.');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res
      .status(500)
      .json({ message: 'Error placing order', error: error.message });
  }
};
