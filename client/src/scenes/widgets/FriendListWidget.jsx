import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsByUserId } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.friendsByUserId);

  const loggedInUserId = useSelector((state) => state.user._id);

  useEffect(() => {
    dispatch(getFriendsByUserId(userId));
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends[userId]?.length > 0 ? (
          friends[userId].map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              showAddButton={userId === loggedInUserId}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <p>0 Friends.</p>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
