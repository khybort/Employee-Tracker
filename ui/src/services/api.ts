import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Error:', error);
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh');
      console.log('Refresh token', refreshToken);
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/employees/token/refresh/`,
            { refresh: refreshToken }
          );
          const newAccessToken = response.data.access;

          localStorage.setItem('access', newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
          window.location.href = '/login';
        }
      } else {
        logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
