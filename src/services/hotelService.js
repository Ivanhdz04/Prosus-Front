import api from './api'

export const hotelService = {
  // Get all hotels with pagination
  async getHotels(skip = 0, limit = 100) {
    const response = await api.get(`/hotels/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get hotel by ID
  async getHotelById(hotelId) {
    const response = await api.get(`/hotels/${hotelId}`)
    return response.data
  },

  // Get hotels by trip
  async getHotelsByTrip(tripId) {
    const response = await api.get(`/hotels/trip/${tripId}`)
    return response.data
  },

  // Create hotel
  async createHotel(hotelData) {
    const response = await api.post('/hotels/', hotelData)
    return response.data
  },

  // Update hotel
  async updateHotel(hotelId, hotelData) {
    const response = await api.put(`/hotels/${hotelId}`, hotelData)
    return response.data
  },

  // Delete hotel
  async deleteHotel(hotelId) {
    const response = await api.delete(`/hotels/${hotelId}`)
    return response.data
  },

  // Toggle hotel status
  async toggleHotelStatus(hotelId) {
    const response = await api.patch(`/hotels/${hotelId}/toggle-status`)
    return response.data
  }
} 