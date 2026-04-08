import api from './axiosInstance';

export const facilitiesApi = {

  // GET /api/facilities  →  returns array of facility objects
  getAll: () =>
    api.get('/facilities'),

  // GET /api/facilities/1/slots?date=2025-01-15
  // date must be in YYYY-MM-DD format
  getSlots: (facilityId, date) =>
    api.get('/facilities/' + facilityId + '/slots', { params: { date } }),

};