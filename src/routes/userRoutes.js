const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerSchema } = require('../schemas/userSchema');
const { validateRegistration,validateLogin} = require('../middlewares/validateUser'); // Import it

router.post('/register', validateRegistration(registerSchema), userController.register);

router.post('/login', validateLogin, userController.login);

router.post('/refresh', userController.refresh);
router.post('/exchange-code', userController.exchangeCode);
//router.post('/logout', userController.logout);
// Password reset endpoints
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;