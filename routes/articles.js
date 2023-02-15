import express from "express";
import {
  countviews,
  createArticle,
  deleteArticle,
  getArticlesById,
} from "../controllers/article.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/create", verifyToken, createArticle);
router.get("/:articleId", getArticlesById);
router.post("/updateViews/:articleId", countviews);
router.delete("/delete/:articleId", verifyToken, deleteArticle);

export default router;
