import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

export const checkHealth = async () => {
  try {
    const res = await axios.get(`${apiUrl}/health`);
    return res.status;
  } catch (error) {
    console.error(error);
  }
};
