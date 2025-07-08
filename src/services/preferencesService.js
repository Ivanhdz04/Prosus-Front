import api from './api'

/**
 * Preferences Service
 * 
 * Flow explanation:
 * 1. After user login, getUserPreferencesById() is called to check if user has preferences
 * 2. If the response is empty (no preferences), the preferences form is automatically shown
 * 3. User fills out the preferences form and createUserPreferences() is called to save them
 * 4. Once saved, the form is hidden and user continues to the main application
 */

export const preferencesService = {
  // Get user preferences by user ID
  async getUserPreferencesById(userId) {
    try {
      const response = await api.get(`/preferences/user/${userId}`)
      console.log('API response for user preferences:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      // If it's a 404 (not found), return empty response instead of throwing
      if (error.response?.status === 404) {
        return { data: [], count: 0 }
      }
      throw error
    }
  },

  // Get user preferences
  async getUserPreferences(groupId) {
    const response = await api.get(`/preferences/users?group_id=${groupId}`)
    return response.data
  },

  // Create user preferences
  async createUserPreferences(preferencesData) {
    try {
      console.log('Creating user preferences with data:', JSON.stringify(preferencesData, null, 2))
      
      // Validate data structure before sending
      if (!preferencesData.user_id) {
        throw new Error('user_id is required')
      }
      if (!preferencesData.name_user) {
        throw new Error('name_user is required')
      }
      if (!Array.isArray(preferencesData.preferences)) {
        throw new Error('preferences must be an array')
      }
      
      const response = await api.post('/preferences/users', preferencesData)
      console.log('Preferences created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating user preferences:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      })
      throw error
    }
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