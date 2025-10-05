// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.js"; // Make sure this exists

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://adityaxletscode.github.io", // Your frontend
        "http://localhost:5500", // Optional: local testing
      ];
      if (!origin) return callback(null, true); // Allow server-to-server or Postman
      if (allowedOrigins.indexOf(origin.toLowerCase()) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running at https://expense-tracker-gpov.onrender.com!");
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({
      success: true,
      message: "Sign-up successful",
      name: newUser.name,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Signin route
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    res.json({ success: true, message: "Sign-in successful", name: user.name });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Example expenses route
app.get("/expenses", (req, res) => {
  res.json([
    { id: 1, desc: "Groceries", amount: 200 },
    { id: 2, desc: "Fuel", amount: 100 },
  ]);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server running on port ${PORT} at https://expense-tracker-gpov.onrender.com`
  )
);
