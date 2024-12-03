const Product = require("../../../models/product.model");
const Supplier = require("../../../models/supplier.model");
const { addLog } = require("../helper/log.helper");


exports.addSupplier = async (req, res) => {
    try {
        const { name, contactPerson, contactEmail, contactPhone, address, website } = req.body;

        // Check if the supplier already exists
        const existingSupplier = await Supplier.findOne({ contactEmail });
        if (existingSupplier) {
            return res.status(400).json({ message: "Supplier already exists in the database!" });
        }

        // Create a new supplier
        const newSupplier = new Supplier({
            name,
            contactPerson,
            contactEmail,
            contactPhone,
            address,
            website,
        });

        // Save to MongoDB
        await newSupplier.save();

        // Add log entry
        await addLog("Add Supplier", newSupplier);

        // Return a success response
        return res.status(201).json({
            message: "Supplier added successfully!",
            supplier: newSupplier,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "An error occurred while adding the supplier." });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, category, brand, sku, quantityInStock, price, supplier, warrantyPeriod, condition, specifications } = req.body;

        // Check if the product already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists in the database!" });
        }

        // Process image files and generate URLs
        const images = (req.files || []).map(file => {
            const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
            return `${serverBaseUrl}/uploads/${file.filename}`;
        });

        // Create a new product
        const newProduct = new Product({
            name,
            category,
            brand,
            sku,
            quantityInStock,
            price,
            supplier,
            warrantyPeriod,
            condition,
            specifications,
            images,
        });

        // Save to MongoDB
        await newProduct.save();

        // Add log entry
        await addLog("Add Product", newProduct);

        // Return a success response
        return res.status(201).json({
            message: "Product added successfully!",
            product: newProduct,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message || "An error occurred while adding the product." });
    }
};

// Controller to get all products with pagination
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate page and limit
        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "Page and limit must be positive integers." });
        }

        // Get the total number of products
        const totalProducts = await Product.countDocuments();

        // Calculate the number of products to skip
        const skips = limit * (page - 1);

        // Fetch products with pagination
        const products = await Product.find()
            .skip(skips)
            .limit(limit);

        // Return the paginated results
        return res.status(200).json({
            page,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            products,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message || "An error occurred while fetching products." });
    }
};

// Controller to search products by name, category, or brand
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q || ""; // Default to empty query if none provided

        // Find products matching the search query
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
            ],
        });

        // Return search results
        return res.status(200).json({
            query,
            count: products.length,
            products,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message || "An error occurred while searching for products." });
    }
};



// Controller to get all suppliers with pagination
exports.getAllSuppliers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate page and limit
        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "Page and limit must be positive integers." });
        }

        // Get the total number of suppliers
        const totalSuppliers = await Supplier.countDocuments();

        // Calculate the number of suppliers to skip
        const skips = limit * (page - 1);

        // Fetch suppliers with pagination
        const suppliers = await Supplier.find()
            .skip(skips)
            .limit(limit);

        // Return the paginated results
        return res.status(200).json({
            page,
            totalSuppliers,
            totalPages: Math.ceil(totalSuppliers / limit),
            suppliers,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message || "An error occurred while fetching suppliers." });
    }
};

// Controller to search suppliers by name, contactPerson, or contactEmail
exports.searchSuppliers = async (req, res) => {
    try {
        // Get the search query from the request parameters
        const query = req.query.q;

        // If query is not provided, return an error
        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // Search for suppliers that match the query
        const suppliers = await Supplier.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive match for name
                { contactPerson: { $regex: query, $options: 'i' } }, // Case-insensitive match for contactPerson
                { contactEmail: { $regex: query, $options: 'i' } } // Case-insensitive match for contactEmail
            ]
        });

        // Return the search results
        return res.status(200).json({
            query,
            count: suppliers.length,
            suppliers,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "An error occurred while searching for suppliers."
        });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { name, category, brand, sku, quantityInStock, price, supplier, warrantyPeriod, condition, specifications } = req.body;

        // Find the existing product
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Prepare an object to hold the updates
        const updateData = {};

        // Conditionally add fields to update only if they are provided
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (brand) updateData.brand = brand;
        if (sku) updateData.sku = sku;
        if (quantityInStock) updateData.quantityInStock = quantityInStock;
        if (price) updateData.price = price;
        if (supplier) updateData.supplier = supplier;
        if (warrantyPeriod) updateData.warrantyPeriod = warrantyPeriod;
        if (condition) updateData.condition = condition;
        if (specifications) updateData.specifications = specifications;

        // Handle images if files are provided
        if (req.files && req.files.length > 0) {
            const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
            const newImages = req.files.map(file => `${serverBaseUrl}/uploads/${file.filename}`);
            updateData.images = newImages;
        }

        // Update the product with the new data
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData }, // Only update provided fields
            { new: true, runValidators: true } // Return updated product and validate fields
        );

        if (!updatedProduct) {
            return res.status(500).json({ message: "Failed to update the product." });
        }

        // Return the updated product
        res.status(200).json({
            message: "Product updated successfully!",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "An error occurred while updating the product." });
    }
};


// Controller to remove a supplier by ID

exports.removeSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id; // Extract supplier ID from the URL parameters

        // Check if the supplier exists
        const existingSupplier = await Supplier.findById(supplierId);
        if (!existingSupplier) {
            return res.status(404).json({ message: "Supplier not found!" });
        }

        // Remove the supplier
        await Supplier.findByIdAndDelete(supplierId);

        // Add log entry
        await addLog("Remove Supplier", existingSupplier);

        // Return a success response
        return res.status(200).json({
            message: "Supplier removed successfully!",
            supplier: existingSupplier,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "An error occurred while removing the supplier." });
    }
};



// Controller to remove a product by ID
exports.removeProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from the URL parameters

        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Remove the product
        await Product.findByIdAndDelete(productId);

        // Add log entry
        await addLog("Remove Product", existingProduct);

        // Return a success response
        return res.status(200).json({
            message: "Product removed successfully!",
            product: existingProduct,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "An error occurred while removing the product." });
    }
};
