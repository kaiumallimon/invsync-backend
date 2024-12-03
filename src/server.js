// imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// create express app
const app = express();

// Use middlewares for handling requests
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())


// export app
module.exports = app;



