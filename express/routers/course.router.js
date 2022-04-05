const express = require('express');
const courseRouter = express.Router();
const mongoose = require("../connection"); 

courseRouter.route('/') //localhost:3000/api/courses
    .get(async function (req, res) {
            let courses = await Course.find();      //ASYNC!
            return res.send(courses);
    })
    ;
module.exports = courseRouter;

//module and validator
const Course = mongoose.model(
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
