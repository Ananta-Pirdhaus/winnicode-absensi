const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");

// Fungsi checkFileType
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  }
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("url");

exports.post_images = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        msg: err.message || "File upload error",
      });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({
          success: false,
          msg: "Error: No File Selected!",
        });
      } else {
        try {
          const newImage = await prisma.image.create({
            data: {
              url: `${req.file.filename}`,
              userId: req.userId,
            },
          });

          return res.status(200).json({
            success: true,
            msg: "File Uploaded!",
            file: newImage,
          });
        } catch (error) {
          console.error("Database error:", error);
          return res.status(500).json({
            success: false,
            msg: "Error saving image to database",
            error: error.message,
          });
        }
      }
    }
  });
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await prisma.image.findMany();
    res.json({
      message: "Images retrieved successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
