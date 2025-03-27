import { apiUrl } from "@/constants/urls";
import axios from "axios";

export const getCategories = async () => {
  try {
    const res = await axios.get(`${apiUrl}/categories`);
    if (res.status !== 200) throw new Error("Error fetching categories.");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
