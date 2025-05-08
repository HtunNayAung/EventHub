import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const authService = {
  signup: (userData) => {
    return api.post('/auth/signup', userData);
  },
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
};

// Event services
export const eventService = {
  getAllEvents: () => {
    return api.get('/events');
  },
  getEventById: (id) => {
    return api.get(`/events/${id}`);
  },
  createEvent: (eventData) => {
    return api.post('/events', eventData);
  },
  updateEvent: (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },
  deleteEvent: (id) => {
    return api.delete(`/events/${id}`);
  },
  getEventsByOrganizer: (id) => {
    return api.get(`/events/organizer/${id}`);
  },
  cancelEvent: (eventId, password) => {
    return api.put(`/events/${eventId}/cancel`, { password } );
  },

};

// Registration services
export const registrationService = {
  registerForEvent: (registrationData) => {
    return api.post('/registrations', registrationData);
  },
  getUserRegistrations: (userId) => {
    return api.get(`/registrations/attendee/${userId}`);
  },
  getEventRegistrations: (eventId) => {
    return api.get(`/registrations/event/${eventId}`);
  },
};

export const userService = {
  updateProfile: (userId, profileData) => {
    return api.put(`/users/${userId}/profile`, profileData);
  },
  updatePassword: (userId, passwordData) => {
    return api.put(`/users/${userId}/password`, passwordData);
  }
};

export default api;