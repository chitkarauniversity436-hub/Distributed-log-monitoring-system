import User from "../models/User.js";

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

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add user",
      error: error.message
    });
  }
};