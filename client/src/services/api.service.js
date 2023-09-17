const API_URL = "http://localhost:3001"; //"https://bamboo-social-network.onrender.com";

export const loginUser = async (values) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async (values) => {
  try {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserServer = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFriendsServer = async (userId, token) => {
  try {
    const friends = await fetch(`${API_URL}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => response.json());
    return friends;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const patchFriendServer = async (_id, friendId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${_id}/${friendId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    return response;
  } catch (error) {
    alert(error);
    console.error("Error during login:", error);
    throw error;
  }
};

export const handlePostServer = async (_id, post, image, token) => {
  const formData = new FormData();
  formData.append("userId", _id);
  formData.append("description", post);
  if (image) {
    formData.append("picture", image);
    formData.append("picturePath", image.name);
  }

  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPostsServer = async (token) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUserPostsServer = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch get posts");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const handleDeletePostServer = async (postId, token) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch delete posts");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCommentsServer = async (postId, token) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch get comment");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const handleDeleteCommentServer = async (postId, commentId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/posts/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch delete comment");
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const patchLikeServer = async (postId, token, loggedInUserId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addCommentServer = async (
  postId,
  token,
  loggedInUserId,
  commentText
) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: commentText }),
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
