const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const authController = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { restrictToLoggedInUserOnly } = require("../../middlewares/auth.middleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require("./auth.validation");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again later." },
});

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.put("/profile", restrictToLoggedInUserOnly, validate(updateProfileSchema), authController.updateProfile);
router.post("/logout", authController.logout);

module.exports = router;