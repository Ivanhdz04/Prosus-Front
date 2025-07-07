import api from './api'

export const chatService = {
  // Group Chat
  async getGroupMessages() {
    const response = await api.get('/group_chat/group-chat/')
    return response.data
  },

  async getGroupMessageById(messageId) {
    const response = await api.get(`/group_chat/group-chat/${messageId}`)
    return response.data
  },

  async getMessagesByGroup(groupId) {
    const response = await api.get(`/group_chat/group-chat/group/${groupId}`)
    return response.data
  },

  async getUserMessagesInGroup(groupId, userId) {
    const response = await api.get(`/group_chat/group-chat/group/${groupId}/user/${userId}`)
    return response.data
  },

  async sendGroupMessage(messageData) {
    const response = await api.post('/group_chat/group-chat/', messageData)
    return response.data
  },

  async updateGroupMessage(messageId, messageData) {
    const response = await api.put(`/group_chat/group-chat/${messageId}`, messageData)
    return response.data
  },

  async deleteGroupMessage(messageId) {
    const response = await api.delete(`/group_chat/group-chat/${messageId}`)
    return response.data
  },

  async toggleGroupMessageStatus(messageId) {
    const response = await api.patch(`/group_chat/group-chat/${messageId}/toggle`)
    return response.data
  },

  // AI Chat
  async getAIMessages() {
    const response = await api.get('/ia_chat/')
    return response.data
  },

  async getAIMessageById(messageId) {
    const response = await api.get(`/ia_chat/${messageId}`)
    return response.data
  },

  async getAIMessagesByUser(userId) {
    const response = await api.get(`/ia_chat/user/${userId}`)
    return response.data
  },

  async getAIMessagesByGroup(groupId) {
    const response = await api.get(`/ia_chat/ia_chat/group/${groupId}`)
    return response.data
  },

  async getAIMessagesByUserAndGroup(userId, groupId) {
    const response = await api.get(`/ia_chat/user/${userId}/group/${groupId}`)
    return response.data
  },

  async sendAIMessage(messageData) {
    const response = await api.post('/ia_chat/', messageData)
    return response.data
  },

  async updateAIMessage(messageId, messageData) {
    const response = await api.put(`/ia_chat/${messageId}`, messageData)
    return response.data
  },

  async deleteAIMessage(messageId) {
    const response = await api.delete(`/ia_chat/${messageId}`)
    return response.data
  },

  async toggleAIMessageStatus(messageId) {
    const response = await api.patch(`/ia_chat/${messageId}/toggle`)
    return response.data
  },

  // WebSocket endpoints
  async getActiveConnections(groupId) {
    const response = await api.get(`/chat/${groupId}/connections`)
    return response.data
  },

  async getAvailableGroups() {
    const response = await api.get('/chat/groups')
    return response.data
  },

  async getAvailableUsers() {
    const response = await api.get('/chat/users')
    return response.data
  },

  async getGroupMembers(groupId) {
    const response = await api.get(`/chat/groups/${groupId}/members`)
    return response.data
  }
} 