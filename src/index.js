// imports

const express = require('express')
const app = require('./server')
const authRoute = require('./features/auth/routes/auth.routes')
const inventoryRoute = require('./features/inventory/routes/inventory.route')
const logRoute = require('./features/logs/routes/log.routes')
const passport = require('./config/passport.config')
const session = require('express-session')
const connectDB = require('./config/database.config')
const path = require('path')

// configure dotenv
require('dotenv').config

// get port from .env file
const PORT = process.env.PORT || 3000


app.use(express.json())



// use session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultsecret',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect the Express server to the database
connectDB();


// serve static files

app.use('/uploads', express.static('uploads'));

// Use the auth route
app.use('/auth', authRoute);


// use the inventory route
app.use('/inventory', inventoryRoute)


//use the log route
app.use('/logs', logRoute)



// start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})



