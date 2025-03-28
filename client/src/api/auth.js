import api from './axios';

export const login = async (loginPayload) => {
  const res = await api.post('/authentication/token', loginPayload);
  if (res.status !== 201 || !res?.data?.data) {
    throw new Error("error logging in...");
  }

  const userData = res.data.data;
  localStorage.setItem("userData", JSON.stringify(userData));

  return { status: "success", code: res.status, data: userData };
};
