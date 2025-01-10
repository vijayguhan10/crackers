const XLSX = require('xlsx');
const emojis = ['🎆', '🧨', '🎁', '🚀', '🎇', '🎉', '💥', '✨', '🎄', '🎃'];

const { getProductModel } = require('../utils/dbUtil');

exports.addProduct = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }
    const db = req.db;
    const ProductModel = getProductModel(db);

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const productData = { ...req.body, image: randomEmoji };

    const product = new ProductModel(productData);
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
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

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

exports.getActiveProducts = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

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

exports.getProductById = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

    const db = req.db;
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
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

    const db = req.db;
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
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update customer details.' });
    }

    const db = req.db;
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
    return res
      .status(401)
      .json({ message: 'Unauthorized to Create Bulk Products' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const db = req.db;
    const Product = getProductModel(db);

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const productsData = XLSX.utils.sheet_to_json(sheet);

    const products = productsData.map((row) => {
      const { name, price, stockavailable } = row;

      if (!name || !price || !stockavailable) {
        throw new Error('Missing required fields in Excel file');
      }

      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      return {
        image: randomEmoji,
        name,
        price,
        stockavailable
      };
    });

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      message: 'Products created successfully',
      products: createdProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating products', error });
  }
};
