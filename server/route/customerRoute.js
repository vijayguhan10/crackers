const express = require('express');
const router = express.Router();
const customerController = require('../Controller/customerController');
const authMiddleware = require('../Middleware/authMiddleware');

// GET route to find a customer by phone number
router
  .route('/:phone')
  .get(authMiddleware, customerController.findCustomerByPhone);

router.route('/').get(authMiddleware, customerController.getAllCustomers);

module.exports = router;
