import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Đã có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (phone) => apiClient.post('/auth/login', { phone }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/me'),
};

export const courtService = {
  getAll: (filters = {}) => apiClient.get('/courts', { params: filters }),
  getById: (id) => apiClient.get(`/courts/${id}`),
  getNearby: (lat, lng, radius) =>
    apiClient.get('/courts/nearby', { params: { lat, lng, radius } }),
};

export const matchService = {
  getAll: (filters = {}) => apiClient.get('/matches', { params: filters }),
  getById: (id) => apiClient.get(`/matches/${id}`),
  join: (matchId) => apiClient.post(`/matches/${matchId}/join`),
  leave: (matchId) => apiClient.post(`/matches/${matchId}/leave`),
  create: (data) => apiClient.post('/matches', data),
};

export const bookingService = {
  create: (data) => apiClient.post('/bookings', data),
  getAll: () => apiClient.get('/bookings'),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  cancel: (id) => apiClient.patch(`/bookings/${id}/cancel`),
};

export default apiClient;
