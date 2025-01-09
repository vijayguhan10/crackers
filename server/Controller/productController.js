const mongoose = require('mongoose');
const ProductSchema = require('../Model/Product');
const XLSX = require('xlsx');
const emojis = ['🎆', '🧨', '🎁', '🚀', '🎇', '🎉', '💥', '✨', '🎄', '🎃'];

const getDatabaseConnection = (databaseName) => {
  const dbLink = process.env.DATABASE.replace('<DATABASE>', databaseName);
  return mongoose.createConnection(dbLink);
};

const getProductModel = (db) => {
  return db.model('Product', ProductSchema);
};

exports.addProduct = async (req, res) => {
  try {
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);

    const product = new ProductModel(req.body);
    const savedProduct = await product.save();

    res
      .status(200)
      .json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res
      .status(500)
      .json({ message: 'Error adding product', error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const db = req.db;
    const ProductModel = getProductModel(db);

    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);

    if (!req.body.id) {
      return res.status(400).json({ message: 'ID not sent in the request' });
    }
    const product = await ProductModel.findOne({
      _id: req.body.id,
      status: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res
      .status(500)
      .json({ message: 'Error fetching product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);

    const { _id, ...updateData } = req.body;
    console.log('updated data : ', _id);

    if (!_id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (!product.status && !updateData.status) {
      return res.status(400).json({
        message:
          'Inactive products can only be reactivated by setting active to true.'
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Failed to update product.' });
    }

    res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .json({ message: 'Error updating product.', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);

    if (!req.body.id) {
      return res.status(400).json({ message: 'ID not sent in the request' });
    }

    const product = await ProductModel.findById(req.body.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.status) {
      return res.status(400).json({ message: 'Product is already deleted' });
    }

    product.status = false;
    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Product deleted successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
};

exports.createBulkProducts = async (req, res) => {
  if (req.user.role !== 'subadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const db = req.db;
    const Product = getProductModel(db);

    // Read and parse the uploaded Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const productsData = XLSX.utils.sheet_to_json(sheet);

    // Map Excel data to product objects with random emoji for the image field
    const products = productsData.map((row) => {
      const { name, price, stockavailable } = row;

      if (!name || !price || !stockavailable) {
        throw new Error('Missing required fields in Excel file');
      }

      // Generate a random emoji from the pool
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      return {
        image: randomEmoji, // Store the emoji in the image field
        name,
        price,
        stockavailable
      };
    });

    // Insert products into the database
    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      message: 'Products created successfully',
      products: createdProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating products', error });
  }
};

exports.getActiveProducts = async (req, res) => {
  try {
    const db = req.db;
    const ProductModel = getProductModel(db);

    const products = await ProductModel.find({ status: true });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ message: 'Error fetching products', error: error.message });
  }
};
