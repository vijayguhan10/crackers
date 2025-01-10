const express = require("express");
const router = express.Router();
const customerController = require("../Controller/customerController");
const authMiddleware = require("../Middleware/authMiddleware");

// GET route to find a customer by phone number
router.route("/single").get(authMiddleware, customerController.getCustomer);
router.route("/").get(authMiddleware, customerController.getAllCustomers);
router.route("/add").post(authMiddleware, customerController.createCustomer);
router.patch("/changeActive", authMiddleware, customerController.changeActive);
router.put("/update", authMiddleware, customerController.updateCustomer);

module.exports = router;
