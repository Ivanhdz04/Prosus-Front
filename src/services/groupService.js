import api from './api'

export const groupService = {
  // Get all groups
  async getGroups() {
    const response = await api.get('/groups/')
    return response.data
  },

  // Get group by ID
  async getGroupById(groupId) {
    const response = await api.get(`/groups/${groupId}`)
    return response.data
  },

  // Get groups by user
  async getGroupsByUser(userId) {
    const response = await api.get(`/groups/groups/user/${userId}`)
    return response.data
  },

  // Create group
  async createGroup(groupData) {
    const response = await api.post('/groups/', groupData)
    return response.data
  },

  // Update group
  async updateGroup(groupId, groupData) {
    const response = await api.put(`/groups/${groupId}`, groupData)
    return response.data
  },

  // Delete group
  async deleteGroup(groupId) {
    const response = await api.delete(`/groups/${groupId}`)
    return response.data
  },

  // Toggle group status
  async toggleGroupStatus(groupId) {
    const response = await api.patch(`/groups/${groupId}/toggle-status`)
    return response.data
  },

  // Group members management
  async getGroupMembers() {
    const response = await api.get('/groups/group-members/')
    return response.data
  },

  async getGroupMember(groupId, userId) {
    const response = await api.get(`/groups/group-members/${groupId}/${userId}`)
    return response.data
  },

  async getMembersByUser(userId) {
    const response = await api.get(`/groups/group-members/user/${userId}`)
    return response.data
  },

  async addGroupMember(memberData) {
    const response = await api.post('/groups/group-members/', memberData)
    return response.data
  },

  async updateGroupMember(groupId, userId, memberData) {
    const response = await api.put(`/groups/group-members/${groupId}/${userId}`, memberData)
    return response.data
  },

  async removeGroupMember(groupId, userId) {
    const response = await api.delete(`/groups/group-members/${groupId}/${userId}`)
    return response.data
  },

  async toggleMemberStatus(groupId, userId) {
    const response = await api.patch(`/groups/group-members/${groupId}/${userId}/toggle-status`)
    return response.data
  }
} 