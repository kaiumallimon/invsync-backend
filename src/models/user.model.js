// imports
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// create a user-database schema for mongoDB
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: null
    }
}, {
    collection: 'users'
})


// hash the password before saving to keep password
// encrypted

userSchema.pre('save',async function (next) {
    // skip hashing if the password already modified
    if(!this.isModified('password')){
        return next()
    }

    try{
        // hash the password with bcrypt library
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }catch(error){
        return next(error)
    }
})


// function to compare hashed and normal password without dcrypting

userSchema.methods.matchPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password)
}


// export the model

module.exports = mongoose.model('User', userSchema)