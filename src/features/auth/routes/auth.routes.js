// imports

const express = require('express')
const authController = require('../controllers/auth.controller')
const createUpload = require('../../../utils/image.upload');
const { route } = require('../../../server');

// create a router
const router = express.Router()

// setup multer upload instance with the path where
// the image will be saved

const upload = createUpload();

router.post('/register',upload.single('profileImage'), authController.register)
router.post('/login',authController.login)
router.get('/users',authController.getUsers)
router.get('/users/:id',authController.getUserById)



module.exports  = router