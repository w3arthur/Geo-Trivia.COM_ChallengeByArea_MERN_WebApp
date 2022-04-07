const express = require('express');
const courseRouter = express.Router();
const {mongoose, mongoose1} = require("../connection"); 
const error = require('../api/errorMessage.router');

courseRouter.route('/') //localhost:3000/api/courses
    .get(async function (req, res, next) {
        try{
            let courses = await Course.find();      //ASYNC!
            return res.send(courses);
        } catch(err){ return next( err(req) ); }  //error handler
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
