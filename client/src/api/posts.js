import api from "./axios";

export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  if (res.status !== 200) throw new Error("Error fetching post.");
  return res.data;
};

export const getPosts = async (offset = 0, limit = 6, category = null) => {
  const categoryQuery = category ? `&category=${category}` : "";
  const res = await api.get(
    `/feed?offset=${offset}&limit=${limit}${categoryQuery}`
  );
  if (res.status !== 200) throw new Error("Error fetching posts.");
  return res.data;
};
