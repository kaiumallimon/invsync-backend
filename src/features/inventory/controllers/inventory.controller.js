const Product = require("../../../models/product.model");
const Supplier = require("../../../models/supplier.model");

// Controller to add a supplier
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

        // Return a success response
        return res.status(201).json({
            message: "Supplier added successfully!",
            supplier: newSupplier,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "An error occurred while adding the supplier." });
    }
};

// Controller to add a product
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


// Controller to update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from URL params
        const updatedData = req.body; // Updated product data from request body

        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Process and update image URLs if files are provided
        if (req.files && req.files.length > 0) {
            const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
            updatedData.images = req.files.map(file => `${serverBaseUrl}/uploads/${file.filename}`);
        }

        // Update the product with new data
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
            new: true, // Return the updated product document
            runValidators: true, // Run validation rules
        });

        // Return the updated product
        return res.status(200).json({
            message: "Product updated successfully!",
            product: updatedProduct,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "An error occurred while updating the product.",
        });
    }
};
