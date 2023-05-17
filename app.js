// SET Development mode or Production mode
// UNIX : export NODE_ENV=development
// Windows : set NODE_ENV=production
process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() === "production"
    ? "production"
    : "development";
console.log("NODE_ENV => ", process.env.NODE_ENV);
console.log("__dir => ", __dirname);

// environment config
require("dotenv").config();

// 절대경로 설정
require("app-module-path").addPath(__dirname);

const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("routes/index");
const usersRouter = require("routes/users");

const version = "/v1";

const app = express();
const db = require("utils/db");

// database connect
db.connectDB();

// view engine setup
app.disable("etag");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors({ credentials: true, origin: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`/${version}/`, indexRouter);
app.use(`/${version}/users`, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
