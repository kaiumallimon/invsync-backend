const mongoose = require('mongoose');

// Define a schema for Suppliers
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false
  }
});

// Create the Supplier model
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
