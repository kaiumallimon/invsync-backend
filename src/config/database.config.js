// imports
const mongoose = require('mongoose')


// configure dotenv
require('dotenv').config()


// get the database connection string
const db = process.env.MONGODB_URI


// connect to the database

const connectDB = async ()=>{
    try{
        await mongoose.connect(db)
        console.log('MongoDB connected successfully')
    }catch(error){
        console.log('MongoDB connection failed: '+error)
    }
}


// export the connection function
module.exports =connectDB
