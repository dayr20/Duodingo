import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiCall = async (endpoint, options = {}) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur serveur');
  }
  return data;
};

// Auth
export const register = (username, email, password) =>
  apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

export const login = (email, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => apiCall('/auth/me');

// Languages
export const getLanguages = () => apiCall('/languages');
export const getTopics = (languageId) => apiCall(`/languages/${languageId}/topics`);
export const getLessonsForTopic = (langId, topicId) =>
  apiCall(`/languages/${langId}/topics/${topicId}/lessons`);

// Lessons
export const getLesson = (lessonId) => apiCall(`/lessons/${lessonId}`);
export const completeLesson = (lessonId, data) =>
  apiCall(`/lessons/${lessonId}/complete`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Progress
export const getProgress = () => apiCall('/progress');
export const getStats = () => apiCall('/progress/stats');
export const updateHearts = (action) =>
  apiCall('/progress/hearts', {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
