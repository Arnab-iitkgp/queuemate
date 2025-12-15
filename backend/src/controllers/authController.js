const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "somesecretkey";

exports.signup = async (req, res) => {
  try {
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    const { name, email, password, clinicName, adminKey } = req.body;

    //   Validate secret key
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({ message: "Invalid Admin Key" });
    }

    //   Prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //   Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //   Create admin user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin", // Forcefully assign admin
      clinicName,
    });

    //   JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    //   Respond
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        clinicName: user.clinicName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
