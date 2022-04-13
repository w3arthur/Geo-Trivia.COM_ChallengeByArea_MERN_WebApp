const express = require('express');
const courseRouter = express.Router();
const {mongoose, mongoose1} = require("../connection"); 
const { errorHandler } = require('../middlewares');
const { Success } = require('../classes');

courseRouter.route('/') //localhost:3000/api/courses
    .get(async function (req, res, next) {
        console.log(':: course router get');
        errorHandler(req, res, next)( async () => {
            let courses = await Course.find();      //ASYNC!
            return new Success(200, courses);
        });  //error handler 
    })
    ;
module.exports = courseRouter;

//module and validator
const Course = mongoose1.model(
    "Course", // will saved as courses
    new mongoose.Schema({
        name: String,
        author: String,
        tags: [String],
        date: {type: Date, default: Date.now },
        isPublish: Boolean,
        price: Number
    })  //add , trim: true
); 
