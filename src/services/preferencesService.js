import api from './api'

export const preferencesService = {
  // Get user preferences by user ID
  async getUserPreferencesById(userId) {
    const response = await api.get(`/preferences/user/${userId}`)
    return response.data
  },

  // Get user preferences
  async getUserPreferences(groupId) {
    const response = await api.get(`/preferences/users?group_id=${groupId}`)
    return response.data
  },

  // Create user preferences
  async createUserPreferences(preferencesData) {
    const response = await api.post('/preferences/users', preferencesData)
    return response.data
  },

  // Update user preferences
  async updateUserPreferences(userId, preferencesData) {
    const response = await api.put(`/preferences/users/${userId}`, preferencesData)
    return response.data
  },

  // Delete user preferences
  async deleteUserPreferences(userId) {
    const response = await api.delete(`/preferences/users/${userId}`)
    return response.data
  }
} 