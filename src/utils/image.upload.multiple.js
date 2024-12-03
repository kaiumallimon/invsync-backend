const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to create the multer upload instance
function createUpload() {
    // Define the save path relative to the root of the project, inside the 'uploads' folder
    const fullSavePath = path.join(__dirname, "../../uploads");

    // Check if the 'uploads' directory exists, and create it if it doesn't
    if (!fs.existsSync(fullSavePath)) {
        fs.mkdirSync(fullSavePath, { recursive: true });
    }

    // Define the multer storage configuration with dynamic path
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullSavePath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

    // Define the upload middleware with file size limit and file type validation
    const upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
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

    // Return the Multer instance, so we can call .array() later
    return upload;
}

module.exports = createUpload;
