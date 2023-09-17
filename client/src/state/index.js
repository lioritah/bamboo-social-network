import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFriendsServer } from "services/api.service";

const initialState = {
  mode: "light",
  user: null,
  friendsByUserId: {},
  token: null,
  posts: [],
};

const getFriendsByUserId = createAsyncThunk(
  "users/getFriendsByUserId",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.friendsByUserId[userId]) return undefined; // already cached the user's friends
    const response = await getFriendsServer(userId, state.token);
    return {
      friends: response,
      userId,
    };
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getFriendsByUserId.fulfilled, (state, action) => {
      if (!state.action.payload) return; // cache was already done for this user's friends
      state.friendsByUserId = {
        ...state.friendsByUserId,
        [action.payload.userId]: action.payload.friends,
      };
    });
    builder.addCase(getFriendsByUserId.rejected, (state, action) => {});
    builder.addCase(getFriendsByUserId.pending, (state, action) => {});
  },
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      state.friendsByUserId[action.payload.userId] = action.payload.friends;
    },
    patchFriendsBi: (state, action) => {
      state.friendsByUserId[action.payload.friendId] =
        action.payload.friendsOtherUser;
      state.friendsByUserId[action.payload.userId] = action.payload.userFriends;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  patchFriendsBi,
} = authSlice.actions;
export { getFriendsByUserId };
export default authSlice.reducer;
