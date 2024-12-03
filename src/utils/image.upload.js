const multer = require("multer");
const path = require("path");
const fs = require("fs");

// function to create the multer upload instance
function createUpload() {
    // define the save path relative to the root of the project, inside the 'uploads' folder
    // Save in the 'uploads' folder at root
    const fullSavePath = path.join(__dirname, "../../uploads");

    // check if the 'uploads' directory exists, and create it if it doesn't
    if (!fs.existsSync(fullSavePath)) {
        fs.mkdirSync(fullSavePath, { recursive: true });
    }

    // define the multer storage configuration with dynamic path
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Use the 'uploads' folder as the destination
            cb(null, fullSavePath);
        },
        filename: (req, file, cb) => {
            // Use a timestamp-based filename to avoid conflicts
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

    // Define the upload middleware with file size limit and file type validation
    const upload = multer({
        storage: storage,
        // Limit file size to 5MB
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png/;
            const mimeType = fileTypes.test(file.mimetype);
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

            if (mimeType && extName) {
                cb(null, true);
            } else {
                cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
            }
        },
    });

    return upload;
}

module.exports = createUpload;