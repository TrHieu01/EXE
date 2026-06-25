import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
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
    let message = 'Đã có lỗi xảy ra';
    if (error.response) {
      const data = error.response.data;
      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail.map(d => d.msg).join(', ');
      }
    } else if (error.request) {
      message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend và kết nối mạng.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
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
