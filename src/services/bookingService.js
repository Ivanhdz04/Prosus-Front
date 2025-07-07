import api from './api'

export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    const response = await api.post('/bookings/', bookingData)
    return response.data
  },

  // Get all bookings
  async getBookings(skip = 0, limit = 100) {
    const response = await api.get(`/bookings/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get booking by ID
  async getBookingById(bookingId) {
    const response = await api.get(`/bookings/${bookingId}`)
    return response.data
  },

  // Get bookings by user
  async getBookingsByUser(userId) {
    const response = await api.get(`/bookings/user/${userId}`)
    return response.data
  },

  // Get bookings by trip
  async getBookingsByTrip(tripId) {
    const response = await api.get(`/bookings/trip/${tripId}`)
    return response.data
  },

  // Update booking
  async updateBooking(bookingId, bookingData) {
    const response = await api.put(`/bookings/${bookingId}`, bookingData)
    return response.data
  },

  // Delete booking
  async deleteBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`)
    return response.data
  },

  // Toggle booking status
  async toggleBookingStatus(bookingId) {
    const response = await api.patch(`/bookings/${bookingId}/toggle-status`)
    return response.data
  }
} 