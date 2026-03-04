const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { phoneNumber, password, fullName } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        message: "phoneNumber and password are required",
      });
    }


    const existingUser = await userModel.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this phone number already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      phoneNumber,
      password: hashedPassword,
      fullName: fullName || "",           
      avatar: "",                        
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, phoneNumber: newUser.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        phoneNumber: newUser.phoneNumber,
        fullName: newUser.fullName || null,
        image: newUser.avatar || null,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
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
