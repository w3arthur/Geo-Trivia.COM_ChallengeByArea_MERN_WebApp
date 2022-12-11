const { ports } = require('./config');
const serverPort = ports.SERVER_PORT;


const express = require("express");
const app = express();
const http = require('http');
const middlewares = require("./middlewares");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" }, allowedHeaders: ["my-custom-header"], credentials: true });
// set cores for WS ^   //connect to WS only with Auth //origin: ["https://example.com", "https://dev.example.com"],
const path = require("path");

app.use(require("cors")()); //middlewares.corsOptions


io.on('connection', (socket) => { require('./sockets/socketio')(io, socket); });

//app.use( require('helmet')() );
//app.use(middlewares.accessAllowed);

app.use(require("cookie-parser")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middlewares.globalErrorMainHandler);
app.use((req, res, next) => { req.globalUrl = req.url; next(); }); //fix global url path

const routers = require("./routers");


// menora flix app
const menora_flix_folder = 'menoraflix'
const public_folder_menora = 'public_folder';
const menora_middlewares = require(`./${menora_flix_folder}/middlewares`);
const menora_routers = require(`./${menora_flix_folder}/routers`);

app.use(menora_middlewares.globalErrorMainHandler);
app.use("/menoraflix/", express.static(path.join(__dirname, menora_flix_folder, public_folder_menora)));  //global folder

app.route("/menoraflix/").get(async (req, res) => res.status(200).sendFile(path.join(__dirname, menora_flix_folder, public_folder_menora, "index.html")));
app.use("/menoraflix/api/login", menora_routers.loginRouter); //verifyJWT set inside for not registration part!
app.use("/menoraflix/*", menora_middlewares.verifyJWT);
app.use("/menoraflix/api/movie", menora_routers.movieRouter);
app.use("/menoraflix/api/favorites", menora_routers.favoritesRouter);
app.use("/menoraflix/*", menora_middlewares.errorMainHandler);


const public_folder = 'public_folder';
app.use("/api/", express.static(path.join(__dirname, public_folder)));  //global folder
app.route("/api/").get(async (req, res) => res.status(200).sendFile(path.join(__dirname, public_folder, "index.html")));
//app.route("/login").get(async (req, res) => res.status(200).sendFile(path.join(__dirname, public_folder, "login.html")) );

app.use("api/log", routers.logRouter);
app.use("/api/login", routers.loginRouter); //verifyJWT set inside for not registration part!


app.use("/api/*", middlewares.verifyJWT); //403 //Token require middleware
app.use("/api/user", routers.userRouter);
app.use("/api/playingTeam", routers.playingTeamRouter); //verifyJWT set inside for not invitation part!
app.use("/api/area", routers.areaRouter);
app.use("/api/question", routers.questionRouter);

app.use("/api/expert/", routers.expertQuestionsRouter);
app.use("/api/expert/qualify/", routers.expertQualifyRouter);

const react_path = express.static(path.join(path.resolve(__dirname, '..'), 'client', 'dist'));
app.use(react_path);
app.use('/*', react_path)
app.use('/*/*', react_path)




app.route("*").all((req, res) => res.status(404));
app.use("/api/*", middlewares.errorMainHandler); //errorHandler
const port = process.env.PORT || 80 || serverPort || 3444;
server.listen(port, () => console.log(`Listening on port ${port}, Express + WS`));