const express = require("express");
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

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.put("/profile", restrictToLoggedInUserOnly, validate(updateProfileSchema), authController.updateProfile);
router.post("/logout", authController.logout);

module.exports = router;