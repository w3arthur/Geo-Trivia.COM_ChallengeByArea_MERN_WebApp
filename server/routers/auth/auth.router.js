const { Router } = require("express");
const router = Router();

// /api/auth/register
router.use("/register", require('./register.auth.router'));

// /api/auth/login
router.use("/login", require('./login.auth.router'));

// /api/auth/google
router.use("/google", require('./google.auth.router') );

// /api/auth/facebook
router.use("/facebook", require('./facebook.auth.router') );

module.exports = router;