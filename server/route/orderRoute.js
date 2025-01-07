const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');
const authMiddleware = require('../Middleware/authMiddleware');

// POST route to place an order
router.route('/place-order').post(authMiddleware, orderController.placeOrder);

module.exports = router;
