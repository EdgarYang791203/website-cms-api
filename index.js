import express from "express";

const app = express();
const port = 3000;

// 啟用 JSON 解析
app.use(express.json());

const comments = [
  {
    id: 1,
    option: "upvote",
    nickname: "測試",
    comment: "測試",
    time: new Date().getTime(),
  },
  {
    id: 2,
    option: "downvote",
    nickname: "測試2",
    comment: "測試2",
    time: new Date().getTime(),
  },
];

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
