import { apiUrl } from "@/constants/urls";
import axios from "axios";

export const checkHealth = async () => {
  try {
    const res = await axios.get(`${apiUrl}/health`);
    return res.status;
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/users/${id}`);
    if (res.status != 200) throw new Error('Error fetching user.')

    return res.data
  } catch (error) {
    console.error(error);
  }
};
