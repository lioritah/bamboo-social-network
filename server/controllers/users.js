import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const { friends } = await User.findById(id).populate("friends");
    res.status(200).json(friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    let user = await User.findById(id);
    let friend = await User.findById(friendId);
    const areFriends =
      user.friends.includes(friend._id) || friend.friends.includes(user._id);

    if (areFriends) {
      user.friends = user.friends.filter(
        (u) => u.toString() != friend._id.toString()
      );
      friend.friends = friend.friends.filter(
        (u) => u.toString() != user._id.toString()
      );
    } else {
      user.friends = Array.from(new Set([...user.friends, friend._id]));
      friend.friends = Array.from(new Set([...friend.friends, user._id]));
    }
    await user.save();
    await friend.save();
    user = await User.findById(id).populate("friends");
    friend = await User.findById(friendId).populate("friends");
    res.status(200).json({
      userFriends: user.friends,
      friendsOtherUser: friend.friends,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
