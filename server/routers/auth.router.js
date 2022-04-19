const { Router } = require("express");
const router = Router();
const User = require("../modules/user.module");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Uncorrect Email").isEmail(),
    check("password", "Password must be minimum 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Email or Password is incorrect",
        });
      }

      const { email, age, password, passwordConfirm } = req.body;

      const candidate = await User.findOne({ email });

      console.log(candidate)

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} exists` });
      }

      if (password === passwordConfirm) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, age, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: "Registration completed" });
      } else {
        return res.status(400).json({ message: "Password is not correct" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something is wrong, please, try again" });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Email is incorrect").normalizeEmail().isEmail(),
    check("password", "Enter your password").exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Email or Password is incorrect",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
    //   console.log(user);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
      }

      const token = jwt.sign({ userId: user.id }, "It is a big secret", {
        expiresIn: "1h"
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something is wrong, please, try again" });
    }
  }
);

const { googlelogin, facebooklogin } = require("../controllers/auth");

// /api/auth/google
router.post("/google", googlelogin);

// /api/auth/facebook
router.post("/facebook", facebooklogin);

module.exports = router;