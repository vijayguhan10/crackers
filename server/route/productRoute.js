const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const productController = require('../Controller/productController');

const router = express.Router();

router.route('/add').post(authMiddleware, productController.addProduct);
router.route('/').get(authMiddleware, productController.getAllProducts);
router
  .route('/single')
  .get(authMiddleware, productController.getProductDetails);
router.route('/update').patch(authMiddleware, productController.updateProduct);
router.route('/delete').put(authMiddleware, productController.deleteProduct);
router
  .route('/active')
  .get(authMiddleware, productController.getActiveProducts);

router.route('/add').post(authMiddleware, productController.addProduct);

router
  .route('/bulkadd')
  .post(
    authMiddleware,
    upload.single('file'),
    productController.createBulkProducts
  );

module.exports = router;
