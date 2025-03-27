import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const login = async (loginPayload) => {
  try {
    const res = await axios.post(
      `${apiUrl}/authentication/token`,
      loginPayload
    );
    if (res.status !== 201 || !res.data) throw new Error("error logging in...");

    const token = res.data.data;
    localStorage.setItem("authToken", token);
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;

    return { status: "success", code: res.status };
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
