import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      if (Array.isArray(error.response.data)) {
        error.message = error.response.data.map(err => err.msg).join(', ');
      } else if (error.response.data.detail) {
        error.message = error.response.data.detail;
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  return api.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export default api;