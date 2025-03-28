import api from './axios';

export const checkHealth = async () => {
  const res = await api.get('/health');
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
  const res = await api.patch(`/users/${id}/password`, passwordData);
  if (res.status !== 204) throw new Error("Error updating password.");
  return { success: true };
};

export const registerUser = async (userData) => {
  const res = await api.post('/authentication/user', userData)
  if (res.status !== 201 || !res?.data?.data) throw new Error("Error registering user.");
  return res.data.data
}