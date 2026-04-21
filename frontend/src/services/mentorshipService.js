import api from './api';

export const sendMentorshipRequest = (data) => api.post('/mentorship', data);
export const getMentorshipRequests = (type) => api.get('/mentorship', { params: { type } });
export const updateMentorshipRequest = (id, status) => api.put(`/mentorship/${id}`, { status });
