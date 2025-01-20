// const { generatePDF } = require('../utils/GenerateInvoice');
// const { uploadPDFToCloudinary } = require('../utils/uploadPdf');
// const {
//   getCompanyModel,
//   getCustomerModel,
//   getGiftBoxModel,
//   getOrderModel,
//   getProductModel
// } = require('../utils/dbUtil');

// exports.placeOrder = async (req, res) => {
//   const session = await req.db.startSession();
//   session.startTransaction();

//   try {
//     if (req.user.role !== 'subadmin') {
//       return res
//         .status(401)
//         .json({ message: 'Unauthorized to place an order.' });
//     }

//     const db = req.db;
//     const Order = getOrderModel(db);
//     const Customer = getCustomerModel(db);
//     const Company = getCompanyModel(db);
//     const Product = getProductModel(db);
//     const GiftBox = getGiftBoxModel(db);

//     const company = await Company.findOne().session(session);
//     if (!company) {
//       throw new Error('Company details not found');
//     }

//     const { id, products,  discount, total, grandtotal, gst } =
//       req.body;

//     const customer = await Customer.findById(id).session(session);
//     if (!customer) {
//       throw new Error('Customer not found');
//     }

//     const cartItems = [];

//     for (const item of products) {
//       const { productId, quantity } = item;

//       const product = await Product.findById(productId).session(session);
//       if (!product) {
//         throw new Error(`Product not found: ${productId}`);
//       }

//       if (product.stockavailable < quantity) {
//         throw new Error(`Insufficient stock for product: ${product.name}`);
//       }

//       const itemTotal = quantity * product.price;
//       product.stockavailable -= quantity;
//       product.totalsales += quantity;
//       product.totalrevenue += itemTotal;
//       await product.save({ session });

//       cartItems.push({
//         id: product._id,
//         name: product.name,
//         unitprice: product.price,
//         quantity: quantity,
//         total: itemTotal
//       });
//     }

//     // for (const box of giftboxes) {
//     //   const { giftBoxId, quantity } = box;

//     //   const giftBox = await GiftBox.findById(giftBoxId).session(session);
//     //   if (!giftBox) {
//     //     throw new Error(`GiftBox not found: ${giftBoxId}`);
//     //   }

//     //   if (giftBox.stockavailable < quantity) {
//     //     throw new Error(`Insufficient stock for gift box: ${giftBox.name}`);
//     //   }

//     //   const boxTotal = quantity * giftBox.grandtotal;
//     //   giftBox.stockavailable -= quantity;
//     //   giftBox.totalsales += quantity;
//     //   giftBox.totalrevenue += boxTotal;
//     //   await giftBox.save({ session });

//     //   cartItems.push({
//     //     id: giftBox._id,
//     //     name: giftBox.name,
//     //     unitprice: giftBox.grandtotal,
//     //     quantity: quantity,
//     //     total: boxTotal
//     //   });
//     // }

//     const order = new Order({
//       customer: customer._id,
//       cartitems: products,
//       // giftBoxes: giftboxes,
//       discount: discount,
//       total: total,
//       grandtotal: grandtotal,
//       gst: {
//         status: gst.status,
//         percentage: gst.status ? gst.percentage : null,
//         amount: gst.status ? gst.amount : null
//       }
//     });

//     const savedOrder = await order.save({ session });

//     customer.orders.push({
//       id: savedOrder._id,
//       grandtotal: grandtotal,
//       createdat: new Date()
//     });
//     await customer.save({ session });

//     const orderDetails = {
//       cartitems: cartItems,
//       discount: order.discount,
//       total: order.total,
//       grandtotal: order.grandtotal,
//       gst: order.gst,
//       createdat: order.createdat
//     };

//     const pdfParams = {
//       companyDetails: company,
//       customerDetails: customer,
//       orderDetails
//     };

//     try {
//       await generatePDF(pdfParams);

//       const url = await uploadPDFToCloudinary(
//         './invoice.pdf',
//         company.name,
//         customer.name
//       );

//       savedOrder.invoicepdf = url;
//       await savedOrder.save({ session });

//       customer.orders.find((o) => o.id.equals(savedOrder._id)).invoicepdf = url;
//       await customer.save({ session });

//       company.totalinvoices += 1;
//       company.totalrevenue += savedOrder.grandtotal;
//       await company.save({ session });

//       await session.commitTransaction();

//       res.status(200).json({
//         message: 'Order placed successfully and PDF generated',
//         invoiceurl: savedOrder.invoicepdf
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw new Error('Failed to generate or upload the invoice PDF.');
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Error placing order:', error);
//     res
//       .status(500)
//       .json({ message: 'Error placing order', error: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// const mongoose = require("mongoose");
// const orderSchema = require("../Model/Order");
// const customerSchema = require("../Model/Customer");
// const productSchema = require("../Model/Product");
// const companySchema = require("../Model/Company");
// const { generatePDF } = require("../utils/GenerateInvoice");
// const { uploadPDFToCloudinary } = require("../utils/uploadPdf");

// const getOrderModel = (db) => db.model("Order", orderSchema);
// const getCustomerModel = (db) => db.model("Customer", customerSchema);
// const getProductModel = (db) => db.model("Product", productSchema);
// const getCompanyModel = (db) => db.model("Company", companySchema);

// exports.placeOrder = async (req, res) => {
//   try {
//     if (req.user.role !== "subadmin") {
//       return res
//         .status(400)
//         .json({ message: "Unauthorized to place an order." });
//     }

//     const db = req.db;
//     const Order = getOrderModel(db);
//     const Customer = getCustomerModel(db);
//     const Company = getCompanyModel(db);
//     const Product = getProductModel(db);

//     const company = await Company.findOne();
//     if (!company) {
//       return res.status(404).json({ message: "Company details not found" });
//     }

//     const { id, products, discount, total, grandtotal, gst } = req.body;

//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     const cartItems = [];

//     for (const item of products) {
//       const { productId, quantity } = item;

//       const product = await Product.findById(productId);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${productId}` });
//       }

//       if (product.stockavailable < quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for product: ${product.name}`,
//         });
//       }

//       const itemTotal = quantity * product.price;
//       product.stockavailable -= quantity;
//       product.totalsales += quantity;
//       product.totalrevenue += itemTotal;
//       await product.save();

//       cartItems.push({
//         id: product._id,
//         image: product.image,
//         name: product.name,
//         unitprice: product.price,
//         quantity: quantity,
//         total: itemTotal,
//       });
//     }

//     const order = new Order({
//       customer: customer._id,
//       cartitems: products,
//       discount: discount,
//       total: total,
//       grandtotal: grandtotal,
//       gst: {
//         status: gst.status,
//         percentage: gst.status ? gst.percentage : null,
//         amount: gst.status ? gst.amount : null,
//       },
//     });

//     const savedOrder = await order.save();
//     // console.log(savedOrder);

//     customer.orders.push({
//       id: savedOrder._id,
//       grandtotal: grandtotal,
//     });
//     await customer.save();

//     const orderDetails = {
//       cartitems: cartItems,
//       discount: order.discount,
//       total: order.total,
//       grandtotal: order.grandtotal,
//       gst: order.gst,
//     };

//     const pdfParams = {
//       companyDetails: company,
//       customerDetails: customer,
//       orderDetails,
//     };

//     try {
//       await generatePDF(pdfParams);

//       const url = await uploadPDFToCloudinary(
//         "./invoice.pdf",
//         company.name,
//         customer.name
//       );

//       savedOrder.invoicepdf = url;
//       await savedOrder.save();

//       customer.orders.find((o) => o.id.equals(savedOrder._id)).invoicepdf = url;
//       await customer.save();

//       res.status(200).json({
//         message: "Order placed successfully and PDF generated",
//         invoiceurl: savedOrder.invoicepdf,
//       });
//     } catch (error) {
//       throw new Error("Failed to generate or upload the invoice PDF.");
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res
//       .status(500)
//       .json({ message: "Error placing order", error: error.message });
//   }
// };

const { generatePDF } = require('../utils/GenerateInvoice');
const { uploadPDFToCloudinary } = require('../utils/uploadPdf');
const {
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

      // customer.orders.find((o) => o.id.equals(savedOrder._id)).invoicepdf = url;
      // await customer.save({ session });

      company.totalinvoices += 1;
      company.totalrevenue += savedOrder.grandtotal;
      await company.save({ session });

      await session.commitTransaction();

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
