const express = require("express");
const router = express.Router();
const customerController = require("../Controller/customerController");
const authMiddleware = require("../Middleware/authMiddleware");

<<<<<<< HEAD
// GET route to find a customer by phone number
router.route("/single").get(authMiddleware, customerController.getCustomer);
router.route("/").get(authMiddleware, customerController.getAllCustomers);
router.route("/add").post(authMiddleware, customerController.createCustomer);
router.patch("/changeActive", authMiddleware, customerController.changeActive);
router.put("/update", authMiddleware, customerController.updateCustomer);
=======
router.route('/').get(authMiddleware, customerController.getAllCustomers);
router.route('/single').get(authMiddleware, customerController.getCustomer);
router.route('/add').post(authMiddleware, customerController.createCustomer);
router.put('/update', authMiddleware, customerController.updateCustomer);
// router.patch('/changeActive', authMiddleware, customerController.changeActive);
>>>>>>> 6816246fc2c224f8c123eec3d444a965c105d069

module.exports = router;
