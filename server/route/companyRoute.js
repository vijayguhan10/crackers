const express = require('express');
const companyController = require('../Controller/companyController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.route('/create').post(authMiddleware, companyController.createCompany);
router.route('/:id').get(authMiddleware, companyController.getCompanyById);
router.route('/:id').put(authMiddleware, companyController.updateCompanyById);
router
  .route('/:id')
  .delete(authMiddleware, companyController.deleteCompanyById);

module.exports = router;
