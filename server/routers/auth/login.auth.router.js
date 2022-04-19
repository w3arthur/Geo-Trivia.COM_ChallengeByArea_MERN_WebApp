
const { Router } = require("express");
const authLoginRouter = Router();

const { errorHandler } = require('../../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../../classes');

const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../../models");

// /api/auth/login
authLoginRouter.post("/"
  , [
    check("email", "Email is incorrect").normalizeEmail().isEmail(),
    check("password", "Enter your password").exists()
    ]
  , async (req, res) => {
    errorHandler(req, res, next)( async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new ErrorHandler(400, "Email or Password is incorrect" )

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) throw new ErrorHandler(400, "User not found" )
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new ErrorHandler(400, "Password is incorrect" )
        
        const token = jwt.sign({ userId: user.id }, "It is a big secret", { expiresIn: "1h" });

        return new Success(200, { token, userId: user.id })
    });  //error handler 
});

module.exports = authLoginRouter;
