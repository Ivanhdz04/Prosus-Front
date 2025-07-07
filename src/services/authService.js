import api from './api'

export const authService = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const { user, session } = response.data
    
    // Store tokens and user data
    localStorage.setItem('access_token', session.access_token)
    localStorage.setItem('refresh_token', session.refresh_token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { user, session }
  },

  // Register user
  async register(userData) {
    const response = await api.post('/users/', userData)
    return response.data
  },

  // Logout user
  async logout() {
    try {
      await api.get('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    const user = response.data.user
    localStorage.setItem('user', JSON.stringify(user))
    return user
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  // Get stored user data
  getStoredUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    
    const { access_token } = response.data.session
    localStorage.setItem('access_token', access_token)
    
    return { access_token }
  },

  // Check if user exists by email
  async checkUserExists(email) {
    try {
      const response = await api.get(`/users/email/${email}`)
      return { exists: true, user: response.data }
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false, user: null }
      }
      throw error
    }
  }
} 