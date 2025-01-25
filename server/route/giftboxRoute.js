const express = require('express');
const router = express.Router();

const {
  createGiftBox,
  getAllGiftBoxes,
  updateGiftBoxById,
  getGiftBoxById,
  getAllActiveGiftBox
} = require('../Controller/giftboxController');

const authMiddleware = require('../Middleware/authMiddleware');

router.post('/', authMiddleware, createGiftBox);
router.get('/', authMiddleware, getAllGiftBoxes);
router.get('/single/:id', authMiddleware, getGiftBoxById);
router.put('/', authMiddleware, updateGiftBoxById);
router.get('/active', authMiddleware, getAllActiveGiftBox);

module.exports = router;
