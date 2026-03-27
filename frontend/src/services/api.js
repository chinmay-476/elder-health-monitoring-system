import axios from 'axios';

export const AUTH_STORAGE_KEY = 'elderHealthUser';

export const getStoredUser = () => {
  const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
};

export const saveStoredUser = (user) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

// Every protected request automatically sends the saved JWT.
api.interceptors.request.use((config) => {
  const user = getStoredUser();

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredUser();
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getProfile: () => api.get('/auth/me'),
};

export const patientService = {
  getPatients: () => api.get('/patients'),
  getPatientById: (patientId) => api.get(`/patient/${patientId}`),
  addPatient: (payload) => api.post('/patients', payload),
  updatePatient: (patientId, payload) => api.put(`/patient/${patientId}`, payload),
};

export const healthService = {
  addRecord: (payload) => api.post('/health', payload),
  updateRecord: (recordId, payload) => api.put(`/health/${recordId}`, payload),
};

export const alertService = {
  getAlerts: () => api.get('/alerts'),
  markRead: (alertId) => api.put(`/alerts/${alertId}/read`),
};

export default api;
