require("dotenv").config();
const { devLog } = require('./api')

const localhostPort = process.env.LOCALHOST_PORT;
//if (process.env.NODE_ENV !== 'production'){  }

const express = require("express");
const app = express();
const http = require('http');
const middlewares = require("./middlewares");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" }, allowedHeaders: ["my-custom-header"], credentials: true } );
// set cores for WS ^   //connect to WS only with Auth //origin: ["https://example.com", "https://dev.example.com"],

io.on('connection', (socket) => { require('./sockets/socketio')(io, socket); });

const path = require("path");
//app.use( require('helmet')() );
app.use(middlewares.accessAllowed);
app.use(require("cors")(middlewares.corsOptions)); 

app.use(require("cookie-parser")());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(middlewares.globalErrorMainHandler);
app.use((req, res, next) => { req.globalUrl = req.url; next(); }); //fix global url path

const routers = require("./routers");

const public_folder = 'public_folder';
app.use("/", express.static(path.join(__dirname, public_folder)));  //global folder
app.route("/") .get(async (req, res) => res.status(200).sendFile(path.join(__dirname, public_folder, "index.html")) );
//app.route("/login").get(async (req, res) => res.status(200).sendFile(path.join(__dirname, public_folder, "login.html")) );

app.use("/log", routers.logRouter);
app.use("/api/login", routers.loginRouter); //verifyJWT set inside for not registration part!

if (process.env.NODE_ENV === 'production')  //only on production
    app.use(middlewares.verifyJWT); //403 //Token require middleware
app.use("/api/user", routers.userRouter);
app.use("/api/playingTeam", routers.playingTeamRouter); //verifyJWT set inside for not invitation part!
app.use("/api/area", routers.areaRouter);
app.use("/api/question", routers.questionRouter);

app.use("/api/expert/", routers.expertQuestionsRouter);
app.use("/api/expert/qualify/", routers.expertQualifyRouter);

app.route("*").all((req, res) => res.status(404) );
app.use(middlewares.errorMainHandler); //errorHandler
const port = process.env.PORT || localhostPort || 3500; //3500
server.listen(port, () => /*Developer*/devLog(`Listening on port ${port}, Express + WS`));
/*Developer*/ devLog('Non Production Mode');
