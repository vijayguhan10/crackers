// const mongoose = require('mongoose');
// const orderSchema = require('../Model/Order');
// const customerSchema = require('../Model/Customer');
// const productSchema = require('../Model/Product');
// const companySchema = require('../Model/Company');
// const { generatePDF } = require('../utils/GenerateInvoice');
// const { uploadPDFToCloudinary } = require('../utils/uploadPdf');

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
// const getProductModel = (db) => db.model('Product', productSchema);
// const getCompanyModel = (db) => db.model('Company', companySchema);

// exports.placeOrder = async (req, res) => {
//   try {
//     if (req.user.role !== 'subadmin') {
//       return res
//         .status(403)
//         .json({ message: 'Unauthorized to place an order.' });
//     }

//     const db = await getDatabaseConnection(req.user?.dblink);
//     const Order = getOrderModel(db);
//     const Customer = getCustomerModel(db);
//     const Product = getProductModel(db);
//     const Company = getCompanyModel(db);

//     const { customerDetails, cartItems, tax } = req.body;
//     const { name, address, phone } = customerDetails;

//     // Fetch or create customer
//     let customer = await Customer.findOne({ phone });
//     if (!customer) {
//       customer = new Customer({ name, address, phone });
//       customer = await customer.save();
//     }

//     let overallSum = 0;
//     let totalDiscount = 0;
//     const orderCartItems = [];
//     const pdfCartItems = [];

//     for (const item of cartItems) {
//       let quantityNeeded = item.quantity;
//       const primaryProduct = await Product.findById(item.product);

//       if (!primaryProduct) {
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${item.product}` });
//       }

//       if (
//         primaryProduct.stockavailable === 0 &&
//         !primaryProduct.optionalproduct?.length
//       ) {
//         return res.status(400).json({
//           message: `Insufficient stock and no additional items for product: ${primaryProduct.name}`
//         });
//       }

//       let fulfilledQuantity = 0;
//       let itemTotal = 0;
//       let additionalItemsUsed = [];
//       let itemDiscount = 0;

//       // Handle primary product stock
//       if (primaryProduct.stockavailable > 0) {
//         const quantityFromPrimary = Math.min(
//           quantityNeeded,
//           primaryProduct.stockavailable
//         );
//         fulfilledQuantity += quantityFromPrimary;

//         const primaryItemTotal = quantityFromPrimary * primaryProduct.price;
//         itemTotal += primaryItemTotal;

//         const primaryDiscount = primaryProduct.discount
//           .filter((d) => primaryItemTotal >= d.minimumpurchase)
//           .reduce(
//             (max, current) =>
//               current.discountamount > max.discountamount ? current : max,
//             {
//               discountamount: 0
//             }
//           );

//         itemDiscount = primaryDiscount.discountamount || 0;

//         primaryProduct.stockavailable -= quantityFromPrimary;
//         primaryProduct.totalsales += quantityFromPrimary;
//         primaryProduct.totalrevenue +=
//           quantityFromPrimary * primaryProduct.price;
//         quantityNeeded -= quantityFromPrimary;

//         await primaryProduct.save();
//       }

//       // Handle additional products if needed
//       for (const additionalItemId of primaryProduct.optionalproduct || []) {
//         if (quantityNeeded <= 0) break;

//         const additionalProduct = await Product.findById(additionalItemId);
//         if (!additionalProduct || additionalProduct.stockavailable <= 0)
//           continue;

//         const quantityFromAdditional = Math.min(
//           quantityNeeded,
//           additionalProduct.stockavailable
//         );

//         const additionalItemTotal =
//           quantityFromAdditional * additionalProduct.price;
//         itemTotal += additionalItemTotal;

//         const additionalDiscount = additionalProduct.discount
//           .filter((d) => additionalItemTotal >= d.minimumpurchase)
//           .reduce(
//             (max, current) =>
//               current.discountamount > max.discountamount ? current : max,
//             {
//               discountamount: 0
//             }
//           );

//         const additionalItemDiscount = additionalDiscount.discountamount || 0;
//         itemDiscount += additionalItemDiscount || 0;

//         additionalItemsUsed.push({
//           product: additionalProduct._id,
//           unitprice: additionalProduct.price,
//           quantity: quantityFromAdditional,
//           total: additionalItemTotal
//         });

//         quantityNeeded -= quantityFromAdditional;
//         additionalProduct.stockavailable -= quantityFromAdditional;
//         additionalProduct.totalsales += quantityFromAdditional;
//         additionalProduct.totalrevenue += additionalItemTotal;

//         await additionalProduct.save();
//       }

//       if (quantityNeeded > 0) {
//         return res.status(400).json({
//           message: `Unable to fulfill the requested quantity for product: ${primaryProduct.name}. Not enough stock even with additional items.`
//         });
//       }

//       // Push to orderCartItems
//       orderCartItems.push({
//         product: primaryProduct._id,
//         unitprice: primaryProduct.price,
//         quantity: fulfilledQuantity,
//         total: itemTotal,
//         additionalproducts: additionalItemsUsed
//       });

//       // Push to pdfCartItems
//       const additionalProductsForPdf = [];
//       for (const additionalItem of additionalItemsUsed) {
//         const additionalProductDetails = await Product.findById(
//           additionalItem.product
//         );
//         additionalProductsForPdf.push({
//           description: additionalProductDetails?.name,
//           unitprice: additionalItem.unitprice,
//           quantity: additionalItem.quantity,
//           total: additionalItem.total
//         });
//       }

//       pdfCartItems.push({
//         description: primaryProduct.name,
//         unitprice: primaryProduct.price,
//         quantity: fulfilledQuantity,
//         total: itemTotal,
//         additionalproducts: additionalProductsForPdf
//       });

//       totalDiscount += itemDiscount;
//       overallSum += itemTotal;
//     }

//     const cumulativeAmount = overallSum - totalDiscount + tax;

//     // Create order
//     const order = new Order({
//       customer: customer._id,
//       cartitems: orderCartItems,
//       overallsum: overallSum,
//       tax,
//       discount: totalDiscount,
//       cumulativeamount: cumulativeAmount
//     });

//     const savedOrder = await order.save();

//     // Generate PDF
//     const companyDetails = await Company.findOne({});
//     if (!companyDetails) {
//       return res.status(500).json({ message: 'Company details not found' });
//     }

//     const pdfParams = {
//       companyDetails,
//       customerDetails: {
//         name: customer.name,
//         address: customer.address,
//         phone: customer.phone
//       },
//       orderDetails: {
//         cartItems: pdfCartItems,
//         overallsum: overallSum,
//         tax,
//         discount: totalDiscount,
//         total: cumulativeAmount,
//         createdat: savedOrder.createdat
//       }
//     };

//     try {
//       await generatePDF(pdfParams);
//       const url = await uploadPDFToCloudinary(
//         './invoice.pdf',
//         companyDetails.companyname,
//         customer.name
//       );
//       savedOrder.invoicepdf = url;
//       customer.orders.push({ id: savedOrder._id, invoicepdf: url });
//       await Promise.all([savedOrder.save(), customer.save()]);
//     } catch (error) {
//       throw new Error('Failed to generate or upload the invoice PDF.');
//     }

//     res.status(201).json({
//       message: 'Order placed successfully and PDF generated',
//       customer: {
//         name: customer.name,
//         address: customer.address,
//         phone: customer.phone
//       },
//       order: savedOrder
//     });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     res
//       .status(500)
//       .json({ message: 'Error placing order', error: error.message });
//   }
// };

const mongoose = require('mongoose');
const orderSchema = require('../Model/Order');
const customerSchema = require('../Model/Customer');
const productSchema = require('../Model/Product');
const companySchema = require('../Model/Company');
const { generatePDF } = require('../utils/GenerateInvoice');
const { uploadPDFToCloudinary } = require('../utils/uploadPdf');

// Get models for the respective database
const getOrderModel = (db) => db.model('Order', orderSchema);
const getCustomerModel = (db) => db.model('Customer', customerSchema);
const getProductModel = (db) => db.model('Product', productSchema);
const getCompanyModel = (db) => db.model('Company', companySchema);

exports.placeOrder = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(403)
        .json({ message: 'Unauthorized to place an order.' });
    }

    // Use the database connection established in the auth middleware based on token
    const db = req.db; // This is set in the dbMiddleware
    const Order = getOrderModel(db);
    const Customer = getCustomerModel(db);
    const Product = getProductModel(db);
    const Company = getCompanyModel(db);

    const { customerDetails, cartItems, tax } = req.body;
    const { name, address, phone } = customerDetails;

    // Fetch or create customer
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({ name, address, phone });
      customer = await customer.save();
    }

    let overallSum = 0;
    let totalDiscount = 0;
    const orderCartItems = [];
    const pdfCartItems = [];

    for (const item of cartItems) {
      let quantityNeeded = item.quantity;
      const primaryProduct = await Product.findById(item.product);

      if (!primaryProduct) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      if (
        primaryProduct.stockavailable === 0 &&
        !primaryProduct.optionalproduct?.length
      ) {
        return res.status(400).json({
          message: `Insufficient stock and no additional items for product: ${primaryProduct.name}`
        });
      }

      let fulfilledQuantity = 0;
      let itemTotal = 0;
      let additionalItemsUsed = [];
      let itemDiscount = 0;

      // Handle primary product stock
      if (primaryProduct.stockavailable > 0) {
        const quantityFromPrimary = Math.min(
          quantityNeeded,
          primaryProduct.stockavailable
        );
        fulfilledQuantity += quantityFromPrimary;

        const primaryItemTotal = quantityFromPrimary * primaryProduct.price;
        itemTotal += primaryItemTotal;

        const primaryDiscount = primaryProduct.discount
          .filter((d) => primaryItemTotal >= d.minimumpurchase)
          .reduce(
            (max, current) =>
              current.discountamount > max.discountamount ? current : max,
            {
              discountamount: 0
            }
          );

        itemDiscount = primaryDiscount.discountamount || 0;

        primaryProduct.stockavailable -= quantityFromPrimary;
        primaryProduct.totalsales += quantityFromPrimary;
        primaryProduct.totalrevenue +=
          quantityFromPrimary * primaryProduct.price;
        quantityNeeded -= quantityFromPrimary;

        await primaryProduct.save();
      }

      // Handle additional products if needed
      for (const additionalItemId of primaryProduct.optionalproduct || []) {
        if (quantityNeeded <= 0) break;

        const additionalProduct = await Product.findById(additionalItemId);
        if (!additionalProduct || additionalProduct.stockavailable <= 0)
          continue;

        const quantityFromAdditional = Math.min(
          quantityNeeded,
          additionalProduct.stockavailable
        );

        const additionalItemTotal =
          quantityFromAdditional * additionalProduct.price;
        itemTotal += additionalItemTotal;

        const additionalDiscount = additionalProduct.discount
          .filter((d) => additionalItemTotal >= d.minimumpurchase)
          .reduce(
            (max, current) =>
              current.discountamount > max.discountamount ? current : max,
            {
              discountamount: 0
            }
          );

        const additionalItemDiscount = additionalDiscount.discountamount || 0;
        itemDiscount += additionalItemDiscount || 0;

        additionalItemsUsed.push({
          product: additionalProduct._id,
          unitprice: additionalProduct.price,
          quantity: quantityFromAdditional,
          total: additionalItemTotal
        });

        quantityNeeded -= quantityFromAdditional;
        additionalProduct.stockavailable -= quantityFromAdditional;
        additionalProduct.totalsales += quantityFromAdditional;
        additionalProduct.totalrevenue += additionalItemTotal;

        await additionalProduct.save();
      }

      if (quantityNeeded > 0) {
        return res.status(400).json({
          message: `Unable to fulfill the requested quantity for product: ${primaryProduct.name}. Not enough stock even with additional items.`
        });
      }

      // Push to orderCartItems
      orderCartItems.push({
        product: primaryProduct._id,
        unitprice: primaryProduct.price,
        quantity: fulfilledQuantity,
        total: itemTotal,
        additionalproducts: additionalItemsUsed
      });

      // Push to pdfCartItems
      const additionalProductsForPdf = [];
      for (const additionalItem of additionalItemsUsed) {
        const additionalProductDetails = await Product.findById(
          additionalItem.product
        );
        additionalProductsForPdf.push({
          description: additionalProductDetails?.name,
          unitprice: additionalItem.unitprice,
          quantity: additionalItem.quantity,
          total: additionalItem.total
        });
      }

      pdfCartItems.push({
        description: primaryProduct.name,
        unitprice: primaryProduct.price,
        quantity: fulfilledQuantity,
        total: itemTotal,
        additionalproducts: additionalProductsForPdf
      });

      totalDiscount += itemDiscount;
      overallSum += itemTotal;
    }

    const cumulativeAmount = overallSum - totalDiscount + tax;

    // Create order
    const order = new Order({
      customer: customer._id,
      cartitems: orderCartItems,
      overallsum: overallSum,
      tax,
      discount: totalDiscount,
      cumulativeamount: cumulativeAmount
    });

    const savedOrder = await order.save();

    // Generate PDF
    const companyDetails = await Company.findOne({});
    if (!companyDetails) {
      return res.status(500).json({ message: 'Company details not found' });
    }

    const pdfParams = {
      companyDetails,
      customerDetails: {
        name: customer.name,
        address: customer.address,
        phone: customer.phone
      },
      orderDetails: {
        cartItems: pdfCartItems,
        overallsum: overallSum,
        tax,
        discount: totalDiscount,
        total: cumulativeAmount,
        createdat: savedOrder.createdat
      }
    };

    try {
      await generatePDF(pdfParams);
      const url = await uploadPDFToCloudinary(
        './invoice.pdf',
        companyDetails.companyname,
        customer.name
      );
      savedOrder.invoicepdf = url;
      customer.orders.push({ id: savedOrder._id, invoicepdf: url });
      await Promise.all([savedOrder.save(), customer.save()]);
    } catch (error) {
      throw new Error('Failed to generate or upload the invoice PDF.');
    }

    res.status(201).json({
      message: 'Order placed successfully and PDF generated',
      customer: {
        name: customer.name,
        address: customer.address,
        phone: customer.phone
      },
      order: savedOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res
      .status(500)
      .json({ message: 'Error placing order', error: error.message });
  }
};
