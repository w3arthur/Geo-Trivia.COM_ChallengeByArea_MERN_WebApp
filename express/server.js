require('dotenv').config();
const localhostPort = process.env.LOCALHOST_PORT;
if (process.env.NODE_ENV !== 'production') { }

const debug1 = require('debug')('arthur');   //set DEBUG=arthur & nodemon .
debug1('Hello World');  //npm run debug //set DEBUG=arthur & nodemon . //  chrome://inspect
//  node --inspect index.js	> Attach    // https://www.youtube.com/watch?v=FMsNsSHhRC8&list=PL2uN9BViQt2yzYm8gUzXhOef8YHfPwLC_&index=2&ab_channel=HighVoiceComputing

const express = require('express');
const app = express();

const path = require('path');
const logging = require("./api/loggingFunctions")

//app.use( require('helmet')() );   //protection
app.use( require('./middlewares/accessAllowed.middleware').accessAllowed );
app.use( require('cors')( require('./middlewares/accessAllowed.middleware').corsOptions ) ); 
app.use( express.json() );
app.use (express.urlencoded({ extended: false }) ); //
app.use( require('cookie-parser')() );  //middleware for cookies
//app.use(logging.globalErrorHandler);  //errorHandler for authorization token, validation and global system issues


//index page router
app.use('/', express.static(path.join(__dirname, '/html')));
app.set('views', path.join(__dirname, 'views'));
app.route('/').get( async (req, res) => res.status(200).sendFile(path.join(__dirname, "html", "index.html")) );


//middle where test
//fix global url path
app.use( (req, res, next)=>{req.globalUrl = req.url ;next();} );


//routers
app.use("/api/logging", require("./routers/logging.router/logging.router") );
app.use("/api/users", require("./routers/user.router") );
app.use("/api/login", require("./routers/login.router") );

app.use(require("./middlewares/verifyJWT.middleware"));   //403 //Token require middleware
app.use("/api/courses", require("./routers/course.router") );
app.use("/api/flowers", require("./routers/flower.router") );

app.use(logging.errorHandler);  //errorHandler for authorization token, validation and global system issues

app.route('*')  //404
    .all( (req, res) => { res.status(404);
    if (req.accepts('html')) return res.sendFile(path.join(__dirname, "html", "404.html"));
    else if (req.accepts('json')) return res.json({ "error": "404 Not Found" });
    else return res.type('txt').send("404 Not Found");
    });


const port = process.env.PORT || localhostPort || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`) );
