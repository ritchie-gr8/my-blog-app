import api from "./axios";

export const checkHealth = async () => {
  const res = await api.get("/health");
  return res.status;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  if (res.status !== 200) throw new Error("Error fetching user.");
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  if (res.status !== 200) throw new Error("Error updating user.");
  return res.data;
};

export const resetPassword = async (id, passwordData) => {
  const payload = {
    current_password: passwordData.currentPassword,
    new_password: passwordData.newPassword,
  };
  console.log(payload);
  const res = await api.patch(`/users/${id}/password`, payload);
  if (res.status !== 204) throw new Error("Error updating password.");
  return { success: true };
};

export const registerUser = async (userData) => {
  const res = await api.post("/authentication/user", userData);
  if (res.status !== 201 || !res?.data?.data)
    throw new Error("Error registering user.");
  return res.data.data;
};

export const activateUser = async (token) => {
  try {
    const res = await api.put(`/users/activate/${token}`);
    if (res.status !== 204) throw new Error("Error activating user.");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
