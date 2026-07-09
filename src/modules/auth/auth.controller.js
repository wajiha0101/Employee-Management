const authService = require("./auth.service");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({
      message: "User registered successfully.",
      data: user,
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { token, user } = await authService.loginUser(req.body);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful.",
      data: user,
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return res.status(200).json(result);
  } 
  catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully." });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { token, user } = await authService.updateProfile(req.user.id, req.body);
    res.cookie("token", token, cookieOptions); 
    return res.status(200).json({ message: "Profile updated successfully.", data: user });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};
module.exports = {register,login,forgotPassword,logout,updateProfile};