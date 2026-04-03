import axiosInstance from './axiosInstance';

export const searchTour = (params) => axiosInstance.get('/tour/search', { params });
export const getTourById = (id) => axiosInstance.get(`/tour/${id}`);
export const createTour = (data) => axiosInstance.post('/tour', data);
export const updateTour = (id, data) => axiosInstance.put(`/tour/${id}`, data);
export const deleteTourById = (id) => axiosInstance.delete(`/tour/${id}`);
