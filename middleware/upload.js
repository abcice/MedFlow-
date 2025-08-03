const multer = require('multer');
const path = require('path');

// Storage settings for uploaded patient photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/patients'); // Save files in public folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize multer with storage settings
const upload = multer({ storage: storage });

module.exports = upload;
