const express = require("express");
const router = express.Router();
const customerController = require("../Controller/customerController");
const authMiddleware = require("../Middleware/authMiddleware");

router.route('/').get(authMiddleware, customerController.getAllCustomers);
router.route('/single').get(authMiddleware, customerController.getCustomer);
router.route('/add').post(authMiddleware, customerController.createCustomer);
router.put('/update', authMiddleware, customerController.updateCustomer);
// router.patch('/changeActive', authMiddleware, customerController.changeActive);

module.exports = router;
