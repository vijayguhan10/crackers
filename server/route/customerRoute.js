const express = require('express');
const router = express.Router();
const customerController = require('../Controller/customerController');
const authMiddleware = require('../Middleware/authMiddleware');

router.route('/').get(authMiddleware, customerController.getAllCustomers);
router.route('/single').get(authMiddleware, customerController.getCustomer);
router.route('/add').post(authMiddleware, customerController.createCustomer);
router.route('/update').put(authMiddleware, customerController.updateCustomer);
router
  .route('/history')
  .get(authMiddleware, customerController.getCustomersWithOrderDetails);
// router.patch('/changeActive', authMiddleware, customerController.changeActive);

module.exports = router;
