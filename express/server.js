require('dotenv').config();
const localhostPort = process.env.LOCALHOST_PORT;
if (process.env.NODE_ENV !== 'production') { }

const path = require('path');
const debug1 = require('debug')('arthur');   //set DEBUG=arthur & nodemon .
debug1('Hello World');  //npm run debug //set DEBUG=arthur & nodemon . //  chrome://inspect
//  node --inspect index.js	> Attach    // https://www.youtube.com/watch?v=FMsNsSHhRC8&list=PL2uN9BViQt2yzYm8gUzXhOef8YHfPwLC_&index=2&ab_channel=HighVoiceComputing



const express = require('express');
const app = express();

//app.use( require('helmet')() );
app.use( require('./middlewares/accessAllowed.middleware').accessAllowed );
app.use( require('cors')( require('./middlewares/accessAllowed.middleware').corsOptions ) ); 
//app.use( require('./middlewares/isJson.middleware') );   //isJson middleware
app.use( express.json() );
app.use (express.urlencoded({ extended: false }) ); //
app.use( require('cookie-parser')() );//middleware for cookies
app.use( require('./middlewares/logger.middleware').errorHandler );
app.use( require("./middlewares/logger.middleware").logger );
//const { throws } = require('assert');



//index page router
app.use('/', express.static(path.join(__dirname, '/html')));
app.set('views', path.join(__dirname, 'views'));
app.route('/').get( async (req, res) => res.status(200).sendFile(path.join(__dirname, "html", "index.html")) );




//routers
app.use("/api/logging", require("./routers/logging.router") );

app.use("/api/users", require("./routers/user.router") );
app.use("/api/login", require("./routers/login.router") );
app.use(require("./middlewares/verifyJWT.middleware"));    //Token require middleware
app.use("/api/courses", require("./routers/course.router") );
app.use("/api/flowers", require("./routers/flower.router") );

app.route('*')  //404
    .all( (req, res) => { res.status(404);
    if (req.accepts('html')) return res.sendFile(path.join(__dirname, "html", "404.html"));
    else if (req.accepts('json')) return res.json({ "error": "404 Not Found" });
    else return res.type('txt').send("404 Not Found");
    });


app.use((req, res) => { return; }) //finalize return    //delete

const port = process.env.PORT || localhostPort || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`) );





