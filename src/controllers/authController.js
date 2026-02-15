const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const register = async (req, res) => {
  try {
    const {username, phoneNumber, password, avatar, lastname } = req.body;

    if (!username || ! phoneNumber || !password) {
      return res.status(400).json({
        message: "phoneNumber and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET not configured",
      });
    }

    const existingUser = await userModel.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      phoneNumber,
      password: hashedPassword,
      avatar,
      lastname,
    });

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        lastname: user.lastname,
        image: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { phoneNumber , password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        message: "phoneNumber and password are required",
      });
    }

    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        message: "Phonenumber not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        image: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const allUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password") 
      .lean();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  allUsers,
};
