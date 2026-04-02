import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/api/categories');
export const searchShoes = (params) => axiosInstance.get('/api/shoes/search', { params });
export const getShoesById = (id) => axiosInstance.get(`/api/shoes/${id}`);
export const createShoes = (data) => axiosInstance.post('/api/shoes', data);
export const updateShoes = (id, data) => axiosInstance.put(`/api/shoes/${id}`, data);
export const deleteShoesById = (id) => axiosInstance.delete(`/api/shoes/${id}`);
