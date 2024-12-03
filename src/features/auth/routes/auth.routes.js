// imports

const express = require('express')
const authController = require('../controllers/auth.controller')
const createUpload = require('../../../utils/image.upload')

// create a router
const router = express.Router()

// setup multer upload instance with the path where
// the image will be saved

const upload = createUpload();

router.post('/register',upload.single('profileImage'), authController.register)
router.post('/login',authController.login)


