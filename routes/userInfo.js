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

// 生成以下路由
const router = express.Router();

/**
 * 写路由内部规则和路径，注意路径为 / ，而不是 login ,如果写了 /login ,
 * 那么实际结果 /login/login
 * 使用 router.get 或者 router.post 确定方法
 */

router.get("/", (req, res) => {
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

/**
 * 修改用户信息
 */
router.post("/save", (req, res) => {
  const { age, city, email, hobby, id, img, name } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "ID 是必须的",
      success: false,
    });
  }

  let updateFields = [];
  let updateValues = [];

  if (age) {
    updateFields.push("age = ?");
    updateValues.push(age);
  }
  if (city) {
    updateFields.push("city = ?");
    updateValues.push(city);
  }
  if (email) {
    updateFields.push("email = ?");
    updateValues.push(email);
  }
  if (hobby) {
    updateFields.push("hobby = ?");
    updateValues.push(hobby);
  }
  if (img) {
    updateFields.push("img = ?");
    updateValues.push(img);
  }
  if (name) {
    updateFields.push("name = ?");
    updateValues.push(name);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      message: "至少包含一个非空的字段",
      success: false,
    });
  }
  const updateUser = `UPDATE proj_1_14.users SET ${updateFields.join(
    ","
  )} WHERE id = ?`;
  updateValues.push(id);

  connection.query(updateUser, updateValues, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        data: {
          message: "更新用户信息时出错",
          success: false,
        },
      });
    }

    res.json({
      success: true,
      code: 200,
      data: {
        message: "用户信息更新成功！",
        success: true,
      },
    });
  });
});

/**
 * 删除用户，根据 id
 */
router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      success: true,
      data: {
        message: "id 必传",
        success: true,
      },
    });
  }

  try {
    const deleteUser = "DELETE FROM users WHERE id = ?";
    const [result] = await connection.promise().query(deleteUser, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        data: {
          message: "用户未找到",
          success: false,
        },
      });
    }

    const [allUsers] = await connection.promise().query(selectAllUser);

    res.status(200).json({
      success: true,
      data: {
        message: "用户删除成功",
        success: true,
        users: allUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        message: "删除失败",
        success: false,
      },
    });
  }
});

// 导出这个路由
module.exports = router;
