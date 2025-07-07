import api from './api'

export const flightService = {
  // Get all flights with pagination
  async getFlights(skip = 0, limit = 100) {
    const response = await api.get(`/flights/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get flight by ID
  async getFlightById(flightId) {
    const response = await api.get(`/flights/${flightId}`)
    return response.data
  },

  // Get flights by trip
  async getFlightsByTrip(tripId) {
    const response = await api.get(`/flights/trip/${tripId}`)
    return response.data
  },

  // Create flight
  async createFlight(flightData) {
    const response = await api.post('/flights/', flightData)
    return response.data
  },

  // Update flight
  async updateFlight(flightId, flightData) {
    const response = await api.put(`/flights/${flightId}`, flightData)
    return response.data
  },

  // Delete flight
  async deleteFlight(flightId) {
    const response = await api.delete(`/flights/${flightId}`)
    return response.data
  },

  // Toggle flight status
  async toggleFlightStatus(flightId) {
    const response = await api.patch(`/flights/${flightId}/toggle-status`)
    return response.data
  }
} 