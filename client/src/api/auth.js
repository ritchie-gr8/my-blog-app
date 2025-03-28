import { apiUrl } from "@/constants/urls";
import axios from "axios";

export const login = async (loginPayload) => {
  try {
    const res = await axios.post(
      `${apiUrl}/authentication/token`,
      loginPayload
    );
    if (res.status !== 201 || !res?.data?.data) throw new Error("error logging in...");

    const userData = res.data.data;
    const token = userData.token;
    localStorage.setItem("userData", JSON.stringify(userData));
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;

    return { status: "success", code: res.status, data: userData };
  } catch (error) {
    return error;
  }
};

export const setAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
};
