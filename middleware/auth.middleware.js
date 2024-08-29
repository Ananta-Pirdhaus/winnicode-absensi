require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Log headers received
  console.log("Headers received:", req.headers);

  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    console.log("No token provided.");
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).send({ message: "Unauthorized!" });
    }

    // Log the decoded payload for debugging (optional, be cautious with sensitive data)
    console.log("JWT verified successfully. Decoded payload:", decoded);

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
