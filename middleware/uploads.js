const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"; // Set the upload directory

    // Check if directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name is timestamp + original extension
  },
});

// Set up file filter to only accept certain file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, or .png files are allowed!"));
  }
};

// Initialize upload with storage engine and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 1MB file size limit
  fileFilter: fileFilter,
});

module.exports = upload;
