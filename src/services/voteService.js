import api from './api'

export const voteService = {
  // Get all votes with pagination
  async getVotes(skip = 0, limit = 100) {
    const response = await api.get(`/votes/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get vote by ID
  async getVoteById(voteId) {
    const response = await api.get(`/votes/${voteId}`)
    return response.data
  },

  // Get votes by trip
  async getVotesByTrip(tripId) {
    const response = await api.get(`/votes/by-trip/${tripId}`)
    return response.data
  },

  // Get votes by user
  async getVotesByUser(userId) {
    const response = await api.get(`/votes/by-user/${userId}`)
    return response.data
  },

  // Get votes by user and trip
  async getVotesByUserAndTrip(userId, tripId) {
    const response = await api.get(`/votes/by-user-trip/?user_id=${userId}&trip_id=${tripId}`)
    return response.data
  },

  // Create vote
  async createVote(voteData) {
    const response = await api.post('/votes/', voteData)
    return response.data
  },

  // Update vote
  async updateVote(voteId, voteData) {
    const response = await api.put(`/votes/${voteId}`, voteData)
    return response.data
  },

  // Delete vote
  async deleteVote(voteId) {
    const response = await api.delete(`/votes/${voteId}`)
    return response.data
  },

  // Toggle vote status
  async toggleVoteStatus(voteId) {
    const response = await api.patch(`/votes/${voteId}/toggle`)
    return response.data
  }
} 