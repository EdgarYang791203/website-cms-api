import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// 使用 cors 中間件，允許來自 localhost:5173 的請求
app.use(
  cors({
    origin: "http://localhost:5173", // 允許前端的 URL
  })
);

// 啟用 JSON 解析
app.use(express.json());

const comments = [];

// 測試端點
app.get("/api", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// 取得所有留言
app.get("/api/comments", (req, res) => {
  res.json(comments);
});

// 取得單個留言
app.get("/api/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log("searchId", id);
  const comment = comments.find((comment) => comment.id === id);
  if (!comment) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  res.json(comment);
});

// 創建留言
app.post("/api/comments", (req, res) => {
  const verifiedKeys = ["option", "nickname", "comment", "time"];
  let errorKey = null;
  for (let index = 0; index < verifiedKeys.length; index++) {
    const key = verifiedKeys[index];
    if (!req.body[key]) {
      errorKey = key;
      break;
    }
  }
  if (errorKey) {
    return res.status(422).json({
      message: `${errorKey} is required`,
    });
  }
  const { option, nickname, comment, time } = req.body;
  const newComment = {
    id: comments.length + 1,
    option,
    nickname,
    comment,
    time,
  };

  comments.push(newComment);

  res.status(201).json(newComment);
});

// 刪除留言
app.delete("/api/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  comments.filter((comment) => comment.id !== id);

  res.status(204).send();
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
