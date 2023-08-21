import express from "express";
import {
  commentPost,
  getComments,
  getFeedPosts,
  getUserPosts,
  likePost,
  deleteComment,
  deletePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

// ADD COMMENT
router.post("/:id/comment", verifyToken, commentPost);

// DELETE POST
router.delete("/:postId", verifyToken, deletePost);

// GET COMMENT
router.get("/:postId/comment", verifyToken, getComments);

// Express.js route for deleting a comment from a post
router.delete("/:postId/comment/:commentId", verifyToken, deleteComment);

export default router;
