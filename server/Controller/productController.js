const mongoose = require('mongoose');
const ProductSchema = require('../Model/Product');

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
      .status(201)
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
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);

    const products = await ProductModel.find({ active: true });
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

    const product = await ProductModel.findOne({
      _id: req.params.id,
      active: true
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

    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.active && !req.body.active) {
      return res.status(400).json({
        message:
          'Inactive products can only be reactivated by setting active to true.'
      });
    }
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const db = req.db || (await getDatabaseConnection(req.user?.databaseName));
    const ProductModel = getProductModel(db);
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.active) {
      return res.status(400).json({ message: 'Product is already deleted' });
    }

    product.active = false;
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
