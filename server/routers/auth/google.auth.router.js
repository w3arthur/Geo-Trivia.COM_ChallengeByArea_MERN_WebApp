const express = require("express");
const authGoogleRouter = express.Router();

const { errorHandler } = require('../../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../../classes');

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client( "602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com" );

const { UserModel } = require("../../models");

// google login
authGoogleRouter.post("/", (req, res) => {
  errorHandler(req, res, next)( async () => {
    const { tokenId } = req.body;

    client.verifyIdToken({ idToken: tokenId, audience: "602070662525-cg5up3456lcbdngu7nhji2j6inpi8t1b.apps.googleusercontent.com", })
      .then (async(response) => {
        const { email_verified, email } = response.payload;
        console.log({email})
        const googleUser = await UserModel.findOne({ email });    

        // console.log(googleUser);
        if (!email_verified) 
          return res.status(400).json({ error: "Something went wrong...", });

        const token = jwt.sign({ userId: googleUser.id }
          , "It is a big secret"
          , { expiresIn: "1h", }
          );
        if (googleUser) {
          console.log("User has login!");
          return res.json({ token, userId: googleUser.id });
          }

        let password = email + "222";
        let newUser = new UserModel({ email, password }).save();
        });
  });  //error handler 
});

module.exports = authGoogleRouter;