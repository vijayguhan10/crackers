const { getGiftBoxModel, getProductModel } = require('../utils/dbUtil');

exports.createGiftBox = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to Create Gift Box.' });
    }

    const db = req.db;
    const GiftBox = getGiftBoxModel(db);
    const newGiftBox = new GiftBox(req.body);
    const savedGiftBox = await newGiftBox.save();
    res
      .status(200)
      .json({ message: 'GiftBox created successfully!', data: savedGiftBox });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating GiftBox', error: error.message });
  }
};

exports.getAllGiftBoxes = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to Get All Gift Boxes.' });
    }

    const db = req.db;
    const GiftBox = getGiftBoxModel(db);
    const giftBoxes = await GiftBox.find();
    res.status(200).json(giftBoxes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving GiftBoxes', error: error.message });
  }
};

// exports.getGiftBoxById = async (req, res) => {
//   try {
//     if (req.user.role !== 'subadmin') {
//       return res.status(401).json({ message: 'Unauthorized to Get Gift Box.' });
//     }

//     const db = req.db;
//     const GiftBox = getGiftBoxModel(db);
//     if (!req.params.id) {
//       return res.status(400).json({ message: 'GiftBox ID is required!' });
//     }

//     const giftBox = await GiftBox.findById(req.params.id);
//     if (!giftBox) {
//       return res.status(404).json({ message: 'GiftBox not found!' });
//     }

//     res.status(200).json(giftBox);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching GiftBox',
//       error: error.message
//     });
//   }
// };

exports.getGiftBoxById = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res.status(401).json({ message: 'Unauthorized to Get Gift Box.' });
    }

    const db = req.db;
    const GiftBox = getGiftBoxModel(db);
    const Product = getProductModel(db);
    if (!req.params.id) {
      return res.status(400).json({ message: 'GiftBox ID is required!' });
    }

    const giftBox = await GiftBox.findById(req.params.id).populate({
      path: 'products.productId',
      model: Product,
      select: 'name price image stockavailable totalsales totalrevenue status'
    });

    if (!giftBox) {
      return res.status(404).json({ message: 'GiftBox not found!' });
    }

    const giftBoxWithProducts = giftBox.products.map((product) => ({
      _id: product.productId._id,
      image: product.productId.image,
      name: product.productId.name,
      price: product.productId.price,
      stockavailable: product.productId.stockavailable,
      totalsales: product.productId.totalsales,
      totalrevenue: product.productId.totalrevenue,
      status: product.productId.status,
      quantity: product.quantity // Include quantity directly here
    }));

    const response = {
      ...giftBox.toObject(),
      products: giftBoxWithProducts
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching GiftBox',
      error: error.message
    });
  }
};

exports.updateGiftBoxById = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to update Gift Box.' });
    }

    const db = req.db;
    const GiftBox = getGiftBoxModel(db);

    if (!req.body._id) {
      return res.status(400).json({ message: 'GiftBox ID is required!' });
    }

    const updatedGiftBox = await GiftBox.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    console.log("updatedgiftbox : ",updatedGiftBox);
    if (!updatedGiftBox) {
      return res.status(404).json({ message: 'GiftBox not found!' });
    }

    res.status(200).json({
      message: 'GiftBox updated successfully!',
      data: updatedGiftBox
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating GiftBox',
      error: error.message
    });
  }
};

exports.getAllActiveGiftBox = async (req, res) => {
  try {
    if (req.user.role !== 'subadmin') {
      return res
        .status(401)
        .json({ message: 'Unauthorized to Get Active Gift Boxes.' });
    }

    const db = req.db;
    const GiftBox = getGiftBoxModel(db);
    const giftBoxes = await GiftBox.find({ status: true });
    res.status(200).json(giftBoxes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving GiftBoxes', error: error.message });
  }
};
