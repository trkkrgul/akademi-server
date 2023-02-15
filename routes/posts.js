import express from "express";
import {
  deletePost,
  getFeedPosts,
  getPostById,
  getUserPosts,
  likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/get/:postId", getPostById);
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/delete", verifyToken, deletePost);

export default router;
