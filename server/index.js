//Arhur
require("dotenv").config();    
const localhostPort = process.env.LOCALHOST_PORT;
if (process.env.NODE_ENV !== "production") {
}



//Elias
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const auth = require("./routers/auth.router");
app.use("/api/auth", auth);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || localhostPort || 3500;

const path = require("path");
const routers = require("./routers");
const middlewares = require("./middlewares");

app.use(middlewares.accessAllowed);
app.use(require("cors")(middlewares.corsOptions));

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


mongoose
  .connect(
    "mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
  )
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log("could not connect to mongo", err);
  });


app.listen(PORT, () => {
  console.log(`server is working on ${PORT}`);
});

