/**
 * 登陆页思路：
 * 连接数据库取得用户数据；
 * 不成功返回 401 和提示，前端显示弹框提示
 * 成功返回 token,这里使用 jwt 实现 token
 */

// 导入 express
const express = require("express");
// 导入 jwt
const jwt = require("jsonwebtoken");
// 生成密钥
const MY_SECRET_KEY = "my_secret_key";
// 导入 mysql2
const mysql2 = require("mysql2");

// 定义所有用户信息列表
let users = [];
// 配置数据库
const connection = mysql2.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "yjc010203.",
  database: "proj_1_14",
});
// 连接数据库
connection.connect();
// 定义查询所有用户的语句
const selectAllUser = "SELECT * FROM proj_1_14.users";
// 开始查询
connection.query(selectAllUser, (err, res) => {
  // 处理数据库错误
  if (err) {
    console.log(err);
  }
  // 赋值给 users
  users = res;
});

// 断开数据库
connection.end();

// 生成以下路由
const router = express.Router();

/**
 * 写路由内部规则和路径，注意路径为 / ，而不是 login ,如果写了 /login ,
 * 那么实际结果 /login/login
 * 使用 router.get 或者 router.post 确定方法
 */

router.post("/", (req, res) => {
  // 解构数据
  const { username, password } = req.body;
  console.log(req.body);
  // 判断密码和用户名是否正确
  const user = users.find((item) => {
    return item.username === username && item.password === password;
  });
  // 鉴权失败
  if (!user) {
    return res.status(401).json({ message: "鉴权失败，用户名或者密码错误！" });
  }
  // 生成 token,有效期 暂定一天 24h
  const token = jwt.sign({ ID: user.id }, MY_SECRET_KEY, {
    expiresIn: 2 * 3600 * 1000,
  });
  // 返回token
  res.json({
    message: "yeah!登陆成功!",
    code: 200,
    data: {
      token,
    },
    success: true,
  });
});

// 导出这个路由
module.exports = router;
