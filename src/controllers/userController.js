const userService = require('../services/userService');

//register logic
exports.register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login logic 
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userService.loginUser(username, password);
    
    res.status(200).json({
      message: "Login successful!",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    // We send a 401 Unauthorized for login failures
    res.status(401).json({ error: error.message });
  }
};

// Refresh token logic
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

// Forgot password: generate a reset token (in production this should be emailed)
exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const resetToken = await userService.generateResetTokenByUsername(username);

    // In a real app you would send this token to the user's email address.
    res.status(200).json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reset password using token
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