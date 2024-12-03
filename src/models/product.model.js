// imports
const mongoose = require('mongoose')


// product schema for mongodb

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['Laptop', 'Mobile','PreBuilt Desktop','Tablet' ,'PC Parts', 'Accessory'],
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    sku:{
        type: String,
        unique: true,
        required: true
    },
    quantityInStock:{
        type: Number,
        default: 0,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    supplier:{
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier'
    },
    dateAdded:{
        type: Date,
        default: Date.now
    },
    warrentyPeriod:{
        type: String,
        required: false
    },
    condition:{
        type: String,
        enum:['New','Refurbished','Used'],
        default: 'New'
    },
    specifications: {
        processor: {
          type: String,
          required: false
        },
        ram: {
          type: String,  
          required: false
        },
        storage: {
          type: String,  
          required: false
        },
        displaySize: {
          type: String,  
          required: false
        },
        operatingSystem: {
          type: String,  
          required: false
        },
        color: {
          type: String,  
          required: false
        },
        resolution: {
          type: String, 
          required: false
        },
        camera: {
          type: String,
          required: false
        }
      },
      images: [
        {
          type: String,
          required: false,
          default: []
        }
      ],
})


const Product = mongoose.model('Product', productSchema);

module.exports = Product;