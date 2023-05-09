var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { expressjwt: jwt } = require("express-jwt");
// 生成密钥
const MY_SECRET_KEY = "my_secret_key";
// 导入bodyParser
const bodyParser = require("body-parser");

// 导入路由
var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var profileRouter = require("./routes/profile");
var userInfoRouter = require("./routes/userInfo");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  jwt({
    secret: MY_SECRET_KEY,
    algorithms: ["HS256"], // 加密算法
  }).unless({
    path: ["/", "/login"], //除了这些地址，其他的URL都需要验证
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 使用 bodyParser
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// 注册路由
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/userinfo", userInfoRouter);

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
