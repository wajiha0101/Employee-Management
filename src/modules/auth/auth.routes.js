const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const {registerSchema,loginSchema,forgotPasswordSchema} = require("./auth.validation");
const { restrictToLoggedInUserOnly } = require("../../middlewares/auth.middleware");
const { updateProfileSchema } = require("./auth.validation"); 

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/logout", authController.logout);
router.put("/profile", restrictToLoggedInUserOnly, validate(updateProfileSchema), authController.updateProfile);
module.exports = router;