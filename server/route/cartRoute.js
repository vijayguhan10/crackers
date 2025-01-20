const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const { saveCart, getPendingCart } = require('../Controller/cartController');

router.route('/save').post(authMiddleware, saveCart);
router.route('/pending/:id').get(authMiddleware, getPendingCart);

module.exports = router;
