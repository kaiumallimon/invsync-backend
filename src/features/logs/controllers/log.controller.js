// imports
const LogSchema = require('../../../models/log.model')

// get paginated logs from the database 10 logs at a time
exports.getLogs = async (req, res) => {
    // Set default values and parse the query parameters as integers
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Ensure valid numbers for page and limit
    if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Page and limit must be positive integers.' });
    }
    
    const offset = (page - 1) * limit;

    try {
        // Get total count of logs
        const totalLogs = await LogSchema.countDocuments();

        // Get the paginated logs, sorted by timestamp in descending order
        const logs = await LogSchema.find()
            .sort({ timestamp: -1 }) // Sorting by timestamp in descending order
            .skip(offset)
            .limit(limit);

        // Return paginated logs with pagination info
        res.status(200).json({
            page,
            limit,
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
            logs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
