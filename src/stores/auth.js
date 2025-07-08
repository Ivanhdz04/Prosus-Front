import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { preferencesService } from '@/services/preferencesService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const showPreferencesForm = ref(false)
  const hasPreferences = ref(false)

  // Getters
  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value && !!user.value)
  const userId = computed(() => user.value?.id)

  // Actions
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const { user: userData } = await authService.login(email, password)
      user.value = userData
      isAuthenticated.value = true
      
      // Check if user has preferences
      await checkUserPreferences(userData.id)
      
      return { success: true, user: userData }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const newUser = await authService.register(userData)
      
      // After successful registration, check if user needs to set preferences
      // Note: New users won't have preferences, so we set showPreferencesForm to true
      hasPreferences.value = false
      showPreferencesForm.value = true
      
      return { success: true, user: newUser }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      isAuthenticated.value = false
      showPreferencesForm.value = false
      hasPreferences.value = false
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    if (!authService.isAuthenticated()) {
      return false
    }

    loading.value = true
    error.value = null
    
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      isAuthenticated.value = true
      
      // Check if user has preferences
      await checkUserPreferences(userData.id)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to get user data'
      user.value = null
      isAuthenticated.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  const checkUserPreferences = async (userId) => {
    try {
      const response = await preferencesService.getUserPreferencesById(userId)
      hasPreferences.value = response.count > 0 && response.data.length > 0
      showPreferencesForm.value = !hasPreferences.value
    } catch (err) {
      console.error('Error checking preferences:', err)
      // If there's an error, assume no preferences and show form
      hasPreferences.value = false
      showPreferencesForm.value = true
    }
  }

  const initializeAuth = async () => {
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      user.value = storedUser
      isAuthenticated.value = true
      // Verify token is still valid
      await getCurrentUser()
    }
  }

  const clearError = () => {
    error.value = null
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const hidePreferencesForm = () => {
    showPreferencesForm.value = false
    hasPreferences.value = true
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    showPreferencesForm,
    hasPreferences,
    
    // Getters
    currentUser,
    isLoggedIn,
    userId,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    checkUserPreferences,
    initializeAuth,
    clearError,
    updateUser,
    hidePreferencesForm
  }
}) 