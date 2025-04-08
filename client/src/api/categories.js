import api from './axios';

export const getCategories = async () => {
  const res = await api.get('/categories');
  if (res.status !== 200) throw new Error("Error fetching categories.");
  return res.data;
};

export const getPaginatedCategories = async (query, signal) => {
  const res = await api.get('/categories/paginated', { 
    params: query,
    signal: signal
  });
  if (res.status !== 200) throw new Error("Error fetching categories.");
  return res.data;
};

export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  if (res.status !== 201) throw new Error("Error creating category.");
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await api.patch(`/categories/${id}`, data);
  if (res.status !== 200) throw new Error("Error updating category.");
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  if (res.status !== 204) throw new Error("Error deleting category.");
  return res.data;
};
