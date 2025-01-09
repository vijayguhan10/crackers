const mongoose = require('mongoose');
const giftBoxSchema = require('../Model/GiftBox');

const getGiftBoxModel = (db) => {
  return db.model('GiftBox', giftBoxSchema);
};

exports.createGiftBox = async (req, res) => {
  try {
    const GiftBox = getGiftBoxModel(req.db);
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
    const GiftBox = getGiftBoxModel(req.db);
    const giftBoxes = await GiftBox.find();
    res.status(200).json(giftBoxes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving GiftBoxes', error: error.message });
  }
};

exports.getGiftBoxById = async (req, res) => {
  try {
    const GiftBox = getGiftBoxModel(req.db);
    if (!req.body.id) {
      return res.status(400).json({ message: 'GiftBox ID is required!' });
    }

    const giftBox = await GiftBox.findById(req.body.id);
    if (!giftBox) {
      return res.status(404).json({ message: 'GiftBox not found!' });
    }

    res.status(200).json(giftBox);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching GiftBox',
      error: error.message
    });
  }
};

exports.deleteGiftBoxById = async (req, res) => {
  try {
    const GiftBox = getGiftBoxModel(req.db);

    if (!req.body.id) {
      return res.status(400).json({ message: 'GiftBox ID required!' });
    }

    const updatedGiftBox = await GiftBox.findByIdAndUpdate(
      req.body.id,
      { status: false },
      { new: true }
    );

    if (!updatedGiftBox) {
      return res.status(404).json({ message: 'GiftBox not found!' });
    }

    res.status(200).json({
      message: 'GiftBox marked as inactive successfully!',
      data: updatedGiftBox
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking GiftBox as inactive',
      error: error.message
    });
  }
};

exports.updateGiftBoxById = async (req, res) => {
  try {
    const GiftBox = getGiftBoxModel(req.db);

    if (!req.body.id) {
      return res.status(400).json({ message: 'GiftBox ID is required!' });
    }

    const updatedGiftBox = await GiftBox.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

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
    const GiftBox = getGiftBoxModel(req.db);
    const giftBoxes = await GiftBox.find({ status: true });
    res.status(200).json(giftBoxes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving GiftBoxes', error: error.message });
  }
};
