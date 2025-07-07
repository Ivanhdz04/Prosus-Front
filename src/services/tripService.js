import api from './api'

export const tripService = {
  // Get all trips with pagination
  async getTrips(skip = 0, limit = 100) {
    const response = await api.get(`/trips/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get trip by ID
  async getTripById(tripId) {
    const response = await api.get(`/trips/${tripId}`)
    return response.data
  },

  // Create trip
  async createTrip(tripData) {
    const response = await api.post('/trips/', tripData)
    return response.data
  },

  // Update trip
  async updateTrip(tripId, tripData) {
    const response = await api.put(`/trips/${tripId}`, tripData)
    return response.data
  },

  // Delete trip
  async deleteTrip(tripId) {
    const response = await api.delete(`/trips/${tripId}`)
    return response.data
  },

  // Toggle trip status
  async toggleTripStatus(tripId) {
    const response = await api.patch(`/trips/${tripId}/toggle-status`)
    return response.data
  }
} 