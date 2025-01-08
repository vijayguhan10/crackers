const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');

const productController = require('../Controller/productController');

const router = express.Router();

router.route('/add').post(authMiddleware, productController.addProduct);
router.route('/').get(authMiddleware, productController.getAllProducts);
router.route('/:id').get(authMiddleware, productController.getProductDetails);
router
  .route('/update/:id')
  .patch(authMiddleware, productController.updateProduct);
router
  .route('/delete/:id')
  .delete(authMiddleware, productController.deleteProduct);

router.route('/add').post(authMiddleware, productController.addProduct);

router
  .route('/bulkadd')
  .post(authMiddleware, productController.createBulkProducts);

module.exports = router;
