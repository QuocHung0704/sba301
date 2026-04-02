import axiosInstance from './axiosInstance';

export const searchTour = (params) => axiosInstance.get('/foodtour/search', { params });
export const getTourById = (id) => axiosInstance.get(`/foodtour/${id}`);
export const createTour = (data) => axiosInstance.post('/foodtour', data);
export const updateTour = (id, data) => axiosInstance.put(`/foodtour/${id}`, data);
export const deleteTourById = (id) => axiosInstance.delete(`/foodtour/${id}`);