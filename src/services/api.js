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
  getAttendees: (eventId) => {
    return api.get(`/registrations/events/${eventId}`);
  },

};

// Registration services
export const registrationService = {
  registerForEvent: (registrationData) => {
    return api.post('/registrations', registrationData);
  },
  getAllTicketsForAttendee: (attendeeId) => {
    return api.get(`/registrations/user/${attendeeId}/tickets`);
  },
  approveRegistration: (registrationId) => {
    return api.put(`/registrations/${registrationId}/approve`);
  },
  rejectRegistration: (registrationId) => {
    return api.put(`/registrations/${registrationId}/reject`);
  },
  refundRegistration: (registrationId) => {
    return api.put(`/registrations/${registrationId}/refund`);
  },
  getMyRegistrations: (attendeeId) => {
    return api.get(`/registrations/users/${attendeeId}`);
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

export const paymentService = {
  makePayment: (paymentData) => {
    return api.post('/payments/make', paymentData);
  },
  requestRefund: (registrationId) =>
    api.post(`/payments/${registrationId}/request-refund`, {
      reason: 'User requested refund'
    }),
  approveRefund: (registrationId) =>
    api.put(`/payments/${registrationId}/approve-refund`),
  rejectRefund: (registrationId) =>
    api.put(`/payments/${registrationId}/reject-refund`),
  refundRegistration: (registrationId) =>
    api.post(`/payments/${registrationId}/refund`,  {
      reason: 'Organizer refunded the registration'
    }),
  
};

export const notificationService = {
  sendReminders: (eventId) =>
    api.post(`/notifications/events/${eventId}/send-reminders`),
  getNotis: (userId) =>
    api.get(`/notifications/users/${userId}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`)
}

export default api;