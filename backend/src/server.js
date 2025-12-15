// Top of file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./utils/db");
const tokenRoutes = require("./routes/tokenRoutes");
const authRoutes = require("./routes/authRoutes");
const receptionistRoutes = require("./routes/receptionistRoute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Restrict later
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", tokenRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", receptionistRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Connect MongoDB
connectDB();

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
});

// Make io accessible in routes (optional)
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`  Server listening on port ${PORT}`);
});
