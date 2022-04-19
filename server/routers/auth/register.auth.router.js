const { Router } = require("express");
const authRegisterRouter = Router();

const { errorHandler } = require('../../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../../classes');

const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { UserModel } = require("../../models");

authRegisterRouter.post("/"
  , [
    check("email", "Uncorrect Email").isEmail(),
    check("password", "Password must be minimum 6 symbols").isLength({ min: 6, }),
    ]
  , async (req, res) => {
    errorHandler(req, res, next)( async () => {
        if (!errors.isEmpty()) throw new ErrorHandler(400, "Email or Password is incorrect"  )
        
        const { email, age, password, passwordConfirm } = req.body;

        const candidate = await UserModel.findOne({ email });

        console.log(candidate)

        if (candidate) throw new ErrorHandler(400, `User with email ${email} exists`  )

        if (password !== passwordConfirm) throw new ErrorHandler(400, "Password is not correct"  )

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new UserModel({ email, age, password: hashedPassword });

        const result = await user.save();

        return new Success(201, result)
    });  //error handler 
});

module.exports = authRegisterRouter;