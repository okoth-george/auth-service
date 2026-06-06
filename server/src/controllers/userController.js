// auth-server/src/controllers/authController.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// A temporary global store for our one-time authorization codes (Code -> User Data)
const ephemeralCodes = new Map();

// ==========================================
// 1. REGISTER LOGIC
// ==========================================
exports.register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==========================================
// 2. INTEGRATED LOGIN LOGIC (Generates One-Time Code)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // ⚡ Step 1: Validate credentials using your existing database logic
    const result = await userService.loginUser(username, password);
    
    // Extract clean user data from your database validation result
    const userPayload = { 
      id: result.user.id || result.user._id, 
      username: result.user.username,
     // email: result.user.email 
    };

    // 🔑 Step 2: Generate a secure, unpredictable, random one-time code string
    const secureCode = crypto.randomBytes(24).toString('hex');

    // Step 3: Save the user data inside the temporary dictionary container
    ephemeralCodes.set(secureCode, userPayload);
    
    // Safety Check: Automatically burn the code from RAM after 60 seconds if unused
    setTimeout(() => {
      if (ephemeralCodes.has(secureCode)) {
        ephemeralCodes.delete(secureCode);
        console.log(`[Auth Server] Code ${secureCode.substring(0,6)}... expired.`);
      }
    }, 60000); 

    // Step 4: Hand the harmless short-lived code back to the React frontend
    res.status(200).json({
      message: "Authentication successful! Dispatching callback sequence.",
      code: secureCode,
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// ==========================================
// 3. SERVER-TO-SERVER EXCHANGE ENDPOINT
// ==========================================
exports.exchangeCode = async (req, res) => {
  try {
    const { code } = req.body;

    // Check if code exists in our tracking cache memory map
    if (!code || !ephemeralCodes.has(code)) {
      return res.status(400).json({ error: 'Authorization code invalid or expired.' });
    }

    // Grab the user data mapped to this code string
    const userData = ephemeralCodes.get(code);
    
    // 🔥 CRITICAL EXTRA SECURITY STEP: Immediately drop the code so it cannot be used again!
    ephemeralCodes.delete(code);

    //Pass the data securely to the Django container over the internal Docker network line
    res.status(200).json({
      user: userData,
      message: "Code verified and burned successfully."
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server verification failure." });
  }
};

// ==========================================
// 4. REFRESH TOKEN LOGIC
// ==========================================
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokens = await userService.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      message: "Token refreshed successfully!",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// ==========================================
// 5. PASSWORD RECOVERY UTILITIES
// ==========================================
exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const resetToken = await userService.generateResetTokenByUsername(username);
    res.status(200).json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and newPassword are required' });

    await userService.resetPasswordWithToken(token, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};