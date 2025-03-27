import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPostById = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/posts/${id}`);
    if (res.status != 200) throw new Error("Error fetching post.");

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPosts = async (offset = 0, limit = 6) => {
  try {
    const res = await axios.get(`${apiUrl}/feed?offset=${offset}&limit=${limit}`);
    if (res.status !== 200) throw new Error("Error fetching posts.");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
