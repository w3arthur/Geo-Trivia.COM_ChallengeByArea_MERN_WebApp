require("dotenv").config();
const localhostPort = process.env.LOCALHOST_PORT;
if (process.env.NODE_ENV !== "production") {
}

const express = require("express");
const app = express();

const path = require("path");
const routers = require("./routers");
const middlewares = require("./middlewares");

//app.use( require('helmet')() );   //protection
app.use(middlewares.accessAllowed);
app.use(require("cors")(middlewares.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //
app.use(require("cookie-parser")()); //middleware for cookies
app.use(middlewares.globalErrorMainHandler); //errorHandler for authorization token, validation and global system issues

//index page router
app.use("/", express.static(path.join(__dirname, "/html")));

app.set("views", path.join(__dirname, "views"));

app
  .route("/")
  .get(async (req, res) =>
    res.status(200).sendFile(path.join(__dirname, "html", "index.html"))
  );

//routers
app.use((req, res, next) => {
  req.globalUrl = req.url;
  next();
}); //fix global url path

app.use("/log", routers.logRouter);
app.use("/api/users", routers.userRouter);
app.use("/api/login", routers.loginRouter);
//app.use(middlewares.verifyJWT); //403 //Token require middleware
app.use("/api/flowers", routers.flowerRouter);

app.use(middlewares.errorMainHandler); //errorHandler for authorization token, validation and global system issues

app
  .route("*") //404
  .all((req, res) => {
    res.status(404);
    if (req.accepts("html"))
      return res.sendFile(path.join(__dirname, "html", "404.html"));
    else if (req.accepts("json")) return res.json({ error: "404 Not Found" });
    else return res.type("txt").send("404 Not Found");
  });

const port = process.env.PORT || localhostPort || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
