const express = require('express');
const router = express.Router();
const createUpload = require('../../../utils/image.upload.multiple');
const productController = require('./../controllers/inventory.controller');

// Create a Multer upload instance for handling multiple files
const uploadMultiple = createUpload();

// Route for adding a product with images
router.post('/product/add', uploadMultiple.array('images', 5), productController.addProduct);
router.post('/supplier/add', productController.addSupplier);
router.get('/supplier/get/all', productController.getAllSuppliers);
router.get('/supplier/search', productController.searchSuppliers);
router.get('/product/get/all', productController.getAllProducts);
router.get('/product/search', productController.searchProducts);

module.exports = router;
