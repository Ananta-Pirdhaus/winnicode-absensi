const express = require("express");
const bodyParser = require("body-parser");
const multiparty = require("multiparty");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authRoutes = require("./routes/auth.routes");
const imagesRoutes = require("./routes/image.routes");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

app.use(cookieParser());
app.use(cors()); // Enable CORS for all origins

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Fungsi checkFileType (sesuaikan dengan tipe file yang diizinkan)
function checkFileType(file, cb) {
  // Daftar tipe file yang diizinkan
  const filetypes = /jpeg|jpg|png|gif/;
  // Cek ekstensi file
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Cek mimetype file
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  }
}

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("url");

app.post("/upload", authMiddleware, (req, res) => {
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
          // Simpan URL file yang diupload ke dalam database
          const newImage = await prisma.image.create({
            data: {
              url: `${req.file.filename}`,
              userId: req.userId, // Menggunakan userId dari token yang diekstrak
            },
          });

          // Hapus avatar lama jika ada
          await prisma.image.updateMany({
            where: {
              userId: req.userId,
              isAvatar: true,
            },
            data: {
              isAvatar: false,
            },
          });

          // Tandai gambar yang baru diupload sebagai avatar
          const updatedImage = await prisma.image.update({
            where: { id: newImage.id },
            data: { isAvatar: true },
          });

          // Update URL avatar di user
          await prisma.user.update({
            where: { id: req.userId },
            data: { avatar: updatedImage.url },
          });

          return res.status(200).json({
            success: true,
            msg: "File Uploaded and set as Avatar!",
            file: updatedImage,
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
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling multipart/form-data with multiparty
app.use((req, res, next) => {
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].startsWith("multipart/form-data")
  ) {
    const form = new multiparty.Form({
      // Optional configuration
      uploadDir: "./uploads", // Specify an upload directory if needed
      maxFilesSize: 10 * 1024 * 1024, // Limit file size to 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing multipart form data:", err);
        return next(err);
      }
      req.body = fields;
      req.files = files;
      next();
    });

    // Handle stream errors
    req.on("error", (err) => {
      console.error("Stream error:", err);
      next(err);
    });
  } else {
    next();
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", imagesRoutes);

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 + 1 AS solution`;
    res.send({ message: "Database connection successful", results: result });
  } catch (error) {
    res.status(500).send({
      message: "Error connecting to the database",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res.status(500).send({
    message: "An unexpected error occurred",
    error: err.message,
  });
});

app.use(
  cors({
    origin: "http://localhost:5173", // URL frontend
    credentials: true, // Izinkan pengiriman cookie
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
