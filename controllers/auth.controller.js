const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient"); // pastikan path sesuai dengan lokasi file prismaClient.js

exports.register = async (req, res) => {
  const { username, password, email, kelasId, jurusanId } = req.body;

  if (!username || !password || !kelasId || !jurusanId) {
    return res.status(400).send({
      message: "Please provide username, password, kelasId, and jurusanId",
    });
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email || !emailPattern.test(email)) {
    return res
      .status(400)
      .send({ message: "Please provide a valid @gmail.com email address" });
  }

  let roleId;

  if (email.endsWith("admin@gmail.com")) {
    roleId = 1; // Admin
  } else if (email.endsWith("teacher@gmail.com")) {
    roleId = 2; // Guru
  } else if (email.endsWith("student@gmail.com")) {
    roleId = 3; // Siswa
  } else {
    return res.status(400).send({ message: "Invalid email domain" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).send({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
        roleId: roleId,
        kelasId: kelasId, // Menambahkan kelasId
        jurusanId: jurusanId, // Menambahkan jurusanId
      },
    });

    res.send({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ message: error.message });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Please provide email and password" });
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .send({ message: "Please provide a valid @gmail.com email address" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    // Set the token as an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Use only in HTTPS if in production
      maxAge: 86400 * 1000, // Cookie expires in 24 hours
    });

    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        roleId: 3, // Asumsikan bahwa roleId 3 adalah untuk siswa
      },
      include: {
        kelas: true, // Menyertakan data kelas terkait
        jurusan: true, // Menyertakan data jurusan terkait
      },
    });

    res.status(200).send(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send({ message: error.message });
  }
};

exports.getAllJurusan = async (req, res) => {
  try {
    const jurusan = await prisma.jurusan.findMany(); // Mengambil semua data dari tabel Jurusan

    res.status(200).json(jurusan); // Mengembalikan data sebagai JSON
  } catch (error) {
    console.error("Error fetching jurusan:", error);
    res.status(500).send({ message: error.message });
  }
};

exports.getAllKelas = async (req, res) => {
  try {
    const kelas = await prisma.kelas.findMany(); // Mengambil semua data dari tabel Kelas

    res.status(200).json(kelas); // Mengembalikan data sebagai JSON
  } catch (error) {
    console.error("Error fetching kelas:", error);
    res.status(500).send({ message: error.message });
  }
};
