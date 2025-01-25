const express = require('express');
const userController = require('../Controller/userController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router
  .route('/create-subadmin')
  .post(authMiddleware, userController.createSubAdmin);

router.route('/admins').get(authMiddleware, userController.getAllAdmins);
router.route('/').put(authMiddleware, userController.updateSubAdmin);
module.exports = router;
