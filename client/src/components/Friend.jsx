// components/Friend.jsx
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { patchFriendsBi, setFriends } from "state";
import { patchFriendServer } from "services/api.service";
import { useMemo } from "react";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  showAddButton = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const friends = useSelector((state) => state.friendsByUserId);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = useMemo(
    () => friends[friendId]?.find((friend) => friend._id === _id),
    [friendId, friends, _id]
  );

  const patchFriend = async () => {
    if (_id !== friendId) {
      const { userFriends, friendsOtherUser } = await patchFriendServer(
        friendId,
        _id,
        token
      );

      dispatch(
        patchFriendsBi({
          userId: _id,
          friendId,
          userFriends: friendsOtherUser,
          friendsOtherUser: userFriends,
        })
      );
      return;
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      {showAddButton && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
