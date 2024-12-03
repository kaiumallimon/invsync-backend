const passport = require('../../../config/passport.config')
const User = require('../../../models/user.model')
const createUpload = require('../../../utils/image.upload')


// controller to login a user

exports.login = async (req, res, next)=>{
    passport.authenticate('local', (err,user,info)=>{
        if(err){
            return next(err)
        }

        if(!user){
            return res.status(400).json({
                message: info.message
            })
        }

        req.login(user,(err)=>{
            if(err){
                return next(err)
            }

            return res.status(200).json({
                status: 'successful',
                message: 'Login successful!',
                user: user
            })
        })
    })(req,res,next)
}


// controller for registering an user
exports.register = async (req,res) => {
    try{
        // retreive data from POST-BODY
        const {name, email, password} = req.body


        // check if any user already exists with the email provided

        const existingUser =  await User.findOne({email})

        if(existingUser){
            res.status(400).json({
                message:"User already exists with this email account!"
            })
        }


        // no usr exists, check if image uploaded or not

        let imageUrl = null
        if (req.file) {
            const serverBaseUrl = `${req.protocol}://${req.get("host")}`
            imageUrl = `${serverBaseUrl}/uploads/${req.file.filename}`
        }


        // create a new user
        const newUser = new User({
            name, 
            email,
            password,
            image: imageUrl
        })

        // save the user in database
        await newUser.save()

        // send a response
        res.status(201).json({
            status: 'success',
            message: 'user created successfully',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                imageUrl: newUser.email
            }
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}


// view all users available in database

exports.getUsers = async(req,res)=>{
    try{
        const users = await User.find()

        // exclude password

        users.forEach(user=>{
            user.password = undefined
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
}


// get a specific user by id
exports.getUserById = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        // exclude the password
        user.password = undefined

        res.status(200).json({user})

    }catch(error){
        res.status(500).json({message: error.message})
    }
}