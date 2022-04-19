const express = require("express");
const authFacebookRouter = express.Router();

const { errorHandler } = require('../../middlewares/errorHandlerLogging.middleware');
const { Success, MiddlewareError, ErrorHandler } = require('../../classes');

const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../../models");

// facebook login
authFacebookRouter.post("/", (req, res) => {
  errorHandler(req, res, next)( async () => {
    const { userID, accessToken } = req.body;
    let grurl = `https://graph.facebook.com/v2.11/${userID}/?fields=id,email&access_token=${accessToken}`;
    fetch(grurl, { method: "GET", }).then((res) => res.json())
      .then(async(res) => {
        const { email } = res;
        console.log({email});

        const facebookUser = await UserModel.findOne({ email });
        // console.log(facebookUser);
        const token = jwt.sign({  userId: facebookUser.id },  "It is a big secret",  {expiresIn: "1h"})

        if(facebookUser){
          console.log("User has login!");
          return res.json({ token, userId: facebookUser.id });         
          }
          
        let password = email + "333";
        let newUser = await new UserModel({email, password}).save();
      });
    });  //error handler 
});


module.exports = authFacebookRouter;