const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../prismaClient");
const { sendResetCodeEmail } = require("../../mailer");

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Email already in use.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const forgotPassword = async (data) => {
  const { email } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("No account found with this email.");
    error.statusCode = 404;
    throw error;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: code,
      resetTokenExpiry: expiry,
    },
  });

  await sendResetCodeEmail(email, code);

  return { message: "A reset code has been sent to your email." };
};

const resetPassword = async (data) => {
  const { email, code, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("No account found with this email.");
    error.statusCode = 404;
    throw error;
  }

  if (!user.resetToken || user.resetToken !== code) {
    const error = new Error("Invalid reset code.");
    error.statusCode = 400;
    throw error;
  }

  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    const error = new Error("Reset code has expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: "Password reset successfully." };
};

const updateProfile = async (userId, data) => {
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) {
      const error = new Error("Email already in use.");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const token = jwt.sign(
    { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  };
};

module.exports = {registerUser,loginUser,forgotPassword,resetPassword,updateProfile};