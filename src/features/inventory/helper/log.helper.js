const Log = require("../../../models/log.model");

const addLog = async (operation, data) => {
    try {
        const logEntry = new Log({ operation, data });
        await logEntry.save();
    } catch (error) {
        console.error("An error occurred while adding the log entry: ", error);
    }
};

module.exports = { addLog };
