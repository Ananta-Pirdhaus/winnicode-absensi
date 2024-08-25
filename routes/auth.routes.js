const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/student", authController.getAllStudents);
router.get("/jurusan", authController.getAllJurusan);
router.get("/kelas", authController.getAllKelas);

module.exports = router;
