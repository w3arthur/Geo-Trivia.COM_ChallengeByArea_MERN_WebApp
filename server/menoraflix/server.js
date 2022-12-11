const { ports } = require('./config');
const serverPort = ports.SERVER_PORT;
let developerPort = undefined;
if (process.env.NODE_ENV !== 'production') { developerPort = ports.SERVER_DEVELOPER_PORT; }

const express = require("express");
const app = express();
const middlewares = require("./middlewares");

const path = require("path");
//app.use( require('helmet')() );
app.use(require("cors")());     //Access-Control-Allow-Credentials: true
app.use(require("cookie-parser")());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middlewares.globalErrorMainHandler);




const routers = require("./routers");

const public_folder = 'public_folder';
//app.use("/menoraflix/", express.static(path.join(__dirname, public_folder)));  //global folder
app.route("/menoraflix/").get(async (req, res) => res.status(200).sendFile(path.join(__dirname, public_folder, "index.html")));
app.use("/menoraflix/api/login", routers.loginRouter); //verifyJWT set inside for not registration part!

// //if (process.env.NODE_ENV === 'production') 




app.use(middlewares.verifyJWT); //403 //Token require middleware

app.use("/menoraflix/api/movie", routers.movieRouter);
app.use("/menoraflix/api/favorites", routers.favoritesRouter);


app.route("*").all((req, res) => res.status(404));
app.use(middlewares.errorMainHandler); //errorHandler
const port = developerPort || serverPort || 3500;
app.listen(port, () => console.log(`Listening on port ${port}, Express`));


