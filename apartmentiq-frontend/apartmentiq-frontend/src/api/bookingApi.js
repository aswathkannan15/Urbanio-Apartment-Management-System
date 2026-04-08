// src/api/bookingApi.js
import api from './axiosInstance';

export const bookingApi = {

  // POST /api/bookings
  // data = { slotId, facilityId, memberCount, purpose }
  book: (data) => api.post('/bookings', data),

  // GET /api/bookings/my
  getMyBookings: () => api.get('/bookings/my'),

  // PUT /api/bookings/5/cancel
  cancel: (bookingId) => api.put('/bookings/' + bookingId + '/cancel'),

};