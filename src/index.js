// imports

const express = require('express')
const app = require('./server')
const authRoute = require('./features/auth/routes/auth.routes')
const passport = require('./config/passport.config')
const session = require('express-session')
const connectDB = require('./config/database.config')
const path = require('path')

// configure dotenv
require('dotenv').config

// get port from .env file
const PORT = procces.env.PORT || 3000


// use session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// connect the experess server to database
connectDB()

// use the auth route
app.use('/auth', authRoute)


// start the server

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})



