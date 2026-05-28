const validateRegistration = (schema) => {
  // Return a middleware function
  return (req, res, next) => {
    const { username, password } = req.body || {};

    // Check 1: Does the username exist?
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: "Username is required." });
    }

    // Check 2: Is the password strong enough?
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // If we get here, everything is good! 
    // Calling next() tells Express to move to the Controller.
    next();
  };
};


const validateLogin = (req, res, next) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ 
      error: "Please provide both username and password" 
    });
  }

  // If everything is present, move to the controller
  next();
};



module.exports = { validateRegistration, validateLogin };