import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendLog from "../utils/logger.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message
    });
  }
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      await sendLog({
        level: "warn",
        message: "Login failed - user not found",
        method: "POST",
        endpoint: "/api/users/login",
        statusCode: 401
      });

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      await sendLog({
        level: "warn",
        message: "Login failed - incorrect password",
        method: "POST",
        endpoint: "/api/users/login",
        statusCode: 401
      });

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
    {
        userId: user._id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

    // Send log to Log Service
    await sendLog({
      level: "info",
      message: "User logged in successfully",
      method: "POST",
      endpoint: "/api/users/login",
      statusCode: 200
    });

    // Send response to client
    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    await sendLog({
      level: "error",
      message: error.message,
      method: "POST",
      endpoint: "/api/users/login",
      statusCode: 500
    });

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};