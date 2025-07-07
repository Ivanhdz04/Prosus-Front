import api from './api'

export const itineraryService = {
  // Get all itineraries
  async getItineraries() {
    const response = await api.get('/itineraries/')
    return response.data
  },

  // Get itinerary by ID
  async getItineraryById(itineraryId) {
    const response = await api.get(`/itineraries/${itineraryId}`)
    return response.data
  },

  // Get itineraries by trip
  async getItinerariesByTrip(tripId) {
    const response = await api.get(`/itineraries/trip/${tripId}`)
    return response.data
  },

  // Create itinerary
  async createItinerary(itineraryData) {
    const response = await api.post('/itineraries/', itineraryData)
    return response.data
  },

  // Update itinerary
  async updateItinerary(itineraryId, itineraryData) {
    const response = await api.put(`/itineraries/${itineraryId}`, itineraryData)
    return response.data
  },

  // Delete itinerary
  async deleteItinerary(itineraryId) {
    const response = await api.delete(`/itineraries/${itineraryId}`)
    return response.data
  },

  // Toggle itinerary status
  async toggleItineraryStatus(itineraryId) {
    const response = await api.patch(`/itineraries/${itineraryId}/toggle-status`)
    return response.data
  }
} 