import api from './api'

export const systemService = {
  // Get pool status
  async getPoolStatus() {
    const response = await api.get('/pool-status')
    return response.data
  },

  // Get system health
  async getSystemHealth() {
    const response = await api.get('/health')
    return response.data
  },

  // Get system info
  async getSystemInfo() {
    const response = await api.get('/system/info')
    return response.data
  }
} 