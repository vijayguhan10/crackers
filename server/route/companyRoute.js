const express = require('express');
const companyController = require('../Controller/companyController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.route('/').post(authMiddleware, companyController.createCompany);
router.route('/').get(authMiddleware, companyController.getCompany);
router.route('/user').get(authMiddleware, companyController.getCompanyWithUser);
router.route('/').put(authMiddleware, companyController.updateCompany);
router.route('/').delete(authMiddleware, companyController.deleteCompany);

module.exports = router;
