import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

export const getPostById = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/posts/${id}`);
    if (res.status != 200) throw new Error('Error fetching post.')

    return res.data
  } catch (error) {
    console.error(error);
  }
};
