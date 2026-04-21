import api from './api';

export const getOpportunities = (params) => api.get('/opportunities', { params });
export const createOpportunity = (data) => api.post('/opportunities', data);
export const saveOpportunity = (id) => api.put(`/opportunities/${id}/save`);
export const applyOpportunity = (id) => api.put(`/opportunities/${id}/apply`);
