import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { getUserServer } from "services/api.service";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await getUserServer(userId, token);
    const userData = await response.json();
    setUser(userData);
  };

  useEffect(() => {
    getUser();
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          {userId === loggedInUserId ? (
            <FriendListWidget userId={userId} />
          ) : (
            <></>
          )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userId === loggedInUserId ? (
            <MyPostWidget picturePath={user.picturePath} />
          ) : (
            <></>
          )}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
      <Typography
        textAlign="center"
        fontWeight="500"
        variant="h5"
        sx={{ mb: "1.5rem" }}
      >
        © Lior Itah, All rights reserved.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
