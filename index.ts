import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

interface CommentType {
  id?: number;
  option: string;
  nickname: string;
  comment: string;
  time?: number;
}

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const validation = (payload: Required<CommentType>) => {
  const verifiedKeys: Array<keyof CommentType> = [
    "option",
    "nickname",
    "comment",
  ];
  for (let index = 0; index < verifiedKeys.length; index++) {
    const key = verifiedKeys[index];
    // 檢查欄位是否為空
    if (!payload[key] || payload[key] === "") {
      return `${key} is required`; // 直接返回具體錯誤訊息
    }
    // 檢查 option 是否為 'upvote' 或 'downvote'
    if (payload.option !== "upvote" && payload.option !== "downvote") {
      return `Invalid value for option: must be 'upvote' or 'downvote'`;
    }
    return null;
  }
};

// 使用 cors 中間件，允許來自 localhost:5173 的請求
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // 允許前端的 URL
  })
);

// 啟用 JSON 解析
app.use(express.json());

// 測試端點
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

const apiRouter = express.Router();

app.use("/api", apiRouter);

// 取得所有留言
apiRouter.get("/comments", async (_req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: {
        created: "desc",
      },
      select: {
        id: true,
        option: true,
        nickname: true,
        comment: true,
        created: true,
      },
    });
    console.log("Fetched comments:", comments);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 取得單個留言
apiRouter.get("/comments/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id, // 假設你要找的資料 id 為 1
      },
    });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    res.json(comment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 創建留言
apiRouter.post("/comments", async (req: Request, res: Response) => {
  const errorMessage = validation(req.body);
  if (errorMessage) {
    return res.status(422).json({
      message: errorMessage,
    });
  }
  const { option, nickname, comment } = req.body;

  const newComment: CommentType = {
    option,
    nickname,
    comment,
  };

  try {
    await prisma.comment.create({
      data: newComment,
    });
    res.status(201).json(newComment);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// 修改留言
apiRouter.put("/comments/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const errorMessage = validation(req.body);
  if (errorMessage) {
    return res.status(422).json({
      message: errorMessage,
    });
  }
  const { option, nickname, comment } = req.body;

  const newComment: CommentType = {
    option,
    nickname,
    comment,
  };

  try {
    await prisma.comment.update({
      where: { id },
      data: newComment,
    });
    res.status(201).json(newComment);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// 刪除留言
apiRouter.delete("/comments/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.comment.delete({
      where: { id },
    });
    res.status(204).send();
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
