import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsByUserId, setPosts } from "state";
import PostWidget from "./PostWidget";
import { getPostsServer, getUserPostsServer } from "services/api.service";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await getPostsServer(token);
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await getUserPostsServer(userId, token);

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
    dispatch(getFriendsByUserId(userId));
  }, [token, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts?.length > 0 ? (
        posts
          .slice()
          .reverse()
          .map((post) => {
            if (post && post._id) {
              // Check if the post object and _id property exist
              return (
                <PostWidget
                  key={post._id}
                  postId={post._id}
                  postUserId={post.userId}
                  name={`${post.firstName} ${post.lastName}`}
                  description={post.description}
                  location={post.location}
                  picturePath={post.picturePath}
                  userPicturePath={post.userPicturePath}
                  likes={post.likes}
                  comments={post.comments}
                />
              );
            } else {
              console.log("Invalid post:", post);
              return null;
            }
          })
      ) : (
        <p>No posts available.</p>
      )}
    </>
  );
};

export default PostsWidget;
