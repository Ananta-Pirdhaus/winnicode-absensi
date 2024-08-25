const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors"); // Import cors here
const { PrismaClient } = require("@prisma/client"); // Import PrismaClient here
const prisma = new PrismaClient(); // Create an instance after import

const app = express();

// Use cors middleware
app.use(cors()); // Enable CORS for all origins

app.use(bodyParser.json());
app.use(fileUpload());
// app.use(
//   bodyParser.json({
//     type: ["application/x-www-form-urlencoded", "application/json"], // Support json encoded bodies
//   })
// );

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const authRoutes = require("./routes/auth.routes");
const imagesRoutes = require("./routes/image.routes");
app.use("/api/auth", authRoutes);
app.use("/api", imagesRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
