const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');
const prisma = require('../config/prisma');

// Helper: Generate access and refresh tokens
const generateTokens = (userId, username) => {
  const accessToken = jwt.sign(
    { id: userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId, username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
  return { accessToken, refreshToken };
};

const getResetSecret = () => {
  const secret = process.env.RESET_PASSWORD_SECRET
    || process.env.REFRESH_TOKEN_SECRET
    || process.env.JWT_SECRET;
  if (!secret) throw new Error('Reset secret is not configured');
  return secret;
};

// Register logic
exports.createUser = async (userData) => {
  const { username, password } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return await userRepo.createUser(username, hashedPassword);
};

// Login logic
exports.loginUser = async (username, password) => {
  const user = await userRepo.findByUsername(username);
  if (!user) {
    throw new Error('Invalid username or password'); // 🔒 Security Tip: Generic error prevents user enumeration
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  return {
    user: { id: user.id, username: user.username },
  };
};

// ─── Refresh Token ───────────────────────────────────────────

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userRepo.findById(decoded.id);
    if (!user) throw new Error('User not found');

    return generateTokens(user.id, user.username);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

//used by forget password endpoint
exports.generateResetTokenByUsername = async (username) => {
  const user = await userRepo.findByUsername(username);
  if (!user) throw new Error('User not found');

  const secret = getResetSecret();
  return jwt.sign(
    { id: user.id, username: user.username },
    secret,
    { expiresIn: process.env.RESET_PASSWORD_EXPIRY || '1h' }
  );
};

// ─── Reset Password (by token) ─────────────────────────────
exports.resetPasswordWithToken = async (token, newPassword) => {
  const secret = getResetSecret();

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Invalid or expired reset token');
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) throw new Error('User not found');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await userRepo.updatePassword(user.id, hashedPassword);
};

// ─── Reset Password (by userId directly) ────────────────────

exports.resetPassword = async (userId, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await userRepo.updatePassword(userId, hashedPassword);
};

