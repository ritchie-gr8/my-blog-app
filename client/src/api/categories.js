import api from './axios';

export const getCategories = async () => {
  const res = await api.get('/categories');
  if (res.status !== 200) throw new Error("Error fetching categories.");
  return res.data;
};
