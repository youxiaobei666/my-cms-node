/**
 * 获取用户信息
 */

// 导入 express
const express = require("express");
// 导入 mysql2
const mysql2 = require("mysql2");
// 定义所有用户信息列表
let userInfo = {};
// 定义路由表
const adminRouterList = [
  {
    path: "/user",
    redirect: "/manage",
    meta: {
      title: "user",
      icon: "user",
    },
    props: {
      default: false,
    },
    children: [
      {
        path: "/user/manage",
        name: "userManage",
        meta: {
          title: "userManage",
          icon: "userManage",
        },
        children: [],
      },
      {
        path: "/user/role",
        name: "userRole",
        meta: {
          title: "roleList",
          icon: "roleList",
        },
        children: [],
      },
      {
        path: "/user/permission",
        name: "userPermission",
        meta: {
          title: "permissionList",
          icon: "permissionList",
        },
        children: [],
      },
    ],
  },
  {
    path: "/article",
    redirect: "/article/ranking",
    meta: {
      title: "article",
      icon: "article",
    },
    props: {
      default: false,
    },
    children: [
      {
        path: "/article/ranking",
        name: "articleRanking",
        meta: {
          title: "articleRanking",
          icon: "articleRanking",
        },
        children: [],
      },
      {
        path: "/article/create",
        name: "articleCreate",
        meta: {
          title: "articleCreate",
          icon: "articleCreate",
        },
        children: [],
      },
    ],
  },
];

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
const getUserInfo = `SELECT * FROM proj_1_14.users where username = 'admin'`;
// 开始查询
connection.query(getUserInfo, (err, res) => {
  // 处理数据库错误
  if (err) {
    console.log(err);
  }
  // 赋值给 users
  userInfo = res[0];
  userInfo.adminRouterList = adminRouterList;
});

// 断开数据库
connection.end();
// 生成以下路由
const router = express.Router();

router.get("/", (req, res) => {
  // 解构数据
  {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Authorization, Accept, X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );
  }

  res.json({
    message: "请求用户数据成功！",
    code: 200,
    data: userInfo,
    success: true,
  });
});

// 导出这个路由
module.exports = router;
