import api from "./axios";

export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  if (res.status !== 200) throw new Error("Error fetching post.");
  return res.data;
};

export const getPostsByPage = async (
  page = 1,
  limit = 6,
  category = null,
  search = null,
  status = null,
  searchTerm = null
) => {
  let queryParams = `page=${page}&limit=${limit}`;

  if (category) {
    queryParams += `&category=${encodeURIComponent(category)}`;
  }

  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  if (status) {
    queryParams += `&status=${encodeURIComponent(status.toLowerCase())}`;
  }

  if (searchTerm) {
    queryParams += `&search=${encodeURIComponent(searchTerm)}`;
  }

  const res = await api.get(`/feed?${queryParams}`);
  if (res.status !== 200 || !res?.data?.data)
    throw new Error("Error fetching posts.");
  return res.data.data;
};

export const createPost = async (payload) => {
  const res = await api.post("/posts", payload);
  if (res.status !== 201 || !res?.data?.data)
    throw new Error("Error creating post.");
  return res.data.data;
};

export const updatePost = async (postId, payload) => {
  const res = await api.patch(`/posts/${postId}`, payload);
  if (res.status !== 200 || !res?.data?.data)
    throw new Error("Error updating post.");
  return res.data.data;
};

export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  if (res.status !== 204) throw new Error("Failed to delete post");
  return true;
};

export const likePost = async (postId) => {
  const res = await api.post(`/posts/${postId}/like`);
  if (res.status !== 201 && res.status !== 200)
    throw new Error("Failed to like post");
  return res.data;
};

export const unlikePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}/like`);
  if (res.status !== 204) throw new Error("Failed to unlike post");
  return true;
};

export const createComment = async (payload) => {
  const res = await api.post(`/posts/${payload.post_id}/comments`, payload);
  if (res.status !== 201 || !res?.data?.data)
    throw new Error("Failed to create comment");
  return res.data.data;
};
