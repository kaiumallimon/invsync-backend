const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    operation: { type: String, required: true }, // e.g., "Add Product", "Update Supplier"
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // Store the relevant data
    timestamp: { type: Date, default: Date.now }, // Auto-set the timestamp
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
