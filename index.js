const express = require("express");
const app = express();
const port = 3000;

// 測試端點
app.get("/api", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// 取得所有客戶
app.get("/api/customers", (req, res) => {
  // TODO
});

// 取得單個客戶
app.get("/api/customers/:id", (req, res) => {
  // TODO
});

// 建立客戶
app.post("/api/customers", (req, res) => {
  // TODO
});

// 更新客戶
app.put("/api/customers/:id", (req, res) => {
  // TODO
});

// 刪除客戶
app.delete("/api/customers/:id", (req, res) => {
  // TODO
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
