import Post from "../models/Post.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    console.log(post);
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    console.log("Deleting post with ID:", postId);

    const deletedPost = await Post.findByIdAndDelete(postId);
    console.log("Deleted post:", deletedPost);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;

    const { userId, comment } = req.body;

    const post = await Post.findById(id);
    const user = await User.findById(userId);

    if (user) {
      const commentId = uuidv4(); // Generate a unique ID for the comment

      const newComment = {
        _id: commentId, // Generate a new comment ID

        user: {
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`, // Combine first name and last name
          userPic: `${user.picturePath}`,
          date: new Date().toLocaleString("he-IL", {
            timeZone: "Asia/Jerusalem",
          }),

          // You can include other user information as needed
        },
        comment,
      };
      console.log(req.user);
      post.comments.push(newComment);

      await post.save();
    } else {
      throw new Error("User not found");
    }
    const commentsArr = post.comments;
    res.status(201).json(commentsArr);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments;

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the index of the comment in the post's comments array
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Check if the user trying to delete the comment is the author of the comment
    const loggedInUserId = req.user.id; // Assuming you have middleware to get the authenticated user
    if (post.comments[commentIndex].user._id.toString() !== loggedInUserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post to the database
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
