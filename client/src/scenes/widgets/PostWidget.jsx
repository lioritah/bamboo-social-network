import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import { setPosts } from "state";

import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useNavigate } from "react-router-dom";
import {
  addCommentServer,
  fetchCommentsServer,
  handleDeleteCommentServer,
  handleDeletePostServer,
  patchLikeServer,
} from "services/api.service";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [commentText, setCommentText] = useState("");
  const [commentsArr, setCommentsArr] = useState(comments); // Initialize comments state with the comments prop
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const handleDeletePost = async (postId) => {
    try {
      const response = await handleDeletePostServer(postId, token);
      if (response.ok) {
        dispatch(
          setPosts({ posts: posts.filter((post) => post._id !== postId) })
        );
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await fetchCommentsServer(postId, token);
      const commentsData = await response.json();

      setCommentsArr(commentsData); // Assuming the server returns an array of comments here
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await handleDeleteCommentServer(
        postId,
        commentId,
        token
      );
      if (response.ok) {
        // After successful deletion, update the comments state by removing the deleted comment
        setCommentsArr((prevComments) =>
          prevComments.filter((c) => c._id !== commentId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const patchLike = async () => {
    const response = await patchLikeServer(postId, token, loggedInUserId);
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const addComment = async () => {
    const response = await addCommentServer(
      postId,
      token,
      loggedInUserId,
      commentText
    );

    const newComment = await response.json();

    // Update the comments state with the new comment
    setCommentsArr((prevComments) => [...prevComments, newComment]);

    setCommentText(""); // Clear the input field after adding the comment
  };

  useEffect(() => {
    fetchComments();
  }, [commentText]);

  return (
    <WidgetWrapper m="2rem 0">
      {loggedInUserId === postUserId ? (
        <Box display="flex" justifyContent="space-between">
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />

          <IconButton
            onClick={() => handleDeletePost(postId)} // Attach handleDeleteComment to the button click
          >
            <DeleteOutline />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
        </Box>
      )}

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{commentsArr?.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {commentsArr && commentsArr.length > 0 ? ( // Add a check for commentsArr
            commentsArr.map((comment) => (
              <Box key={comment._id}>
                <Divider />
                <FlexBetween alignItems="center">
                  {comment.user && comment.user.name && (
                    <Typography margin={1} variant="subtitle2">
                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-evenly"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate(`/profile/${comment.user._id.toString()}`);
                            navigate(0);
                          }}
                        >
                          <UserImage image={comment.user.userPic} size="35px" />
                          <p>{comment.user.name}</p>
                        </Box>
                        <p>{comment.user.date}</p>
                      </Box>
                    </Typography>
                  )}
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.comment}
                  </Typography>
                  {comment.user && comment.user._id === loggedInUserId && (
                    <IconButton
                      onClick={() => handleDeleteComment(comment._id)} // Attach handleDeleteComment to the button click
                    >
                      <DeleteOutline />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
            ))
          ) : (
            <p>No comments available.</p>
          )}

          <Divider />
          <Box mt="0.5rem">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addComment();
              }}
            >
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={handleCommentChange}
              />
              <IconButton type="submit">
                <SendOutlined />
              </IconButton>
            </form>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
