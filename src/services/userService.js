import api from './api'

export const userService = {
  // Get all users with pagination
  async getUsers(skip = 0, limit = 100) {
    const response = await api.get(`/users/?skip=${skip}&limit=${limit}`)
    return response.data
  },

  // Get user by ID
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Get user by email
  async getUserByEmail(email) {
    const response = await api.get(`/users/email/${email}`)
    return response.data
  },

  // Get users by group
  async getUsersByGroup(groupId) {
    const response = await api.get(`/users/group_members/${groupId}`)
    return response.data
  },

  // Create user
  async createUser(userData) {
    const response = await api.post('/users/', userData)
    return response.data
  },

  // Update user
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  },

  // Delete user
  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },

  // Toggle user status
  async toggleUserStatus(userId) {
    const response = await api.patch(`/users/${userId}/toggle-status`)
    return response.data
  }
} 