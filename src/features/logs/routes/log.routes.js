const express = require('express');
const router = express.Router();
const logController = require('./../controllers/log.controller');


// Route for adding a product with images

router.get('/get', logController.getLogs)


module.exports = router;
