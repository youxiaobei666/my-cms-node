// 导入 express
const express = require("express");

// 导入 mysql2
const mysql2 = require("mysql2");

// 定义所有用户信息列表
let userInfo = [];
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
  userInfo = res;
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

router.get("/", (req, res) => {
  // 设置 跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS"
  );
  console.log(userInfo);

  // 返回token
  res.json({
    message: "获取所有用户表成功!",
    code: 200,
    data: {
      userInfo,
    },
    success: true,
  });
});

// 导出这个路由
module.exports = router;
