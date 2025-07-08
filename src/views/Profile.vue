<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="glass-effect p-4 border-b border-gray-700">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-2xl">🏠</router-link>
          <div>
            <h1 class="text-xl font-bold text-white">User Profile</h1>
            <p class="text-gray-400 text-sm">Preferences & settings</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/group-chat" class="btn-secondary text-sm">
            💬 Group Chat
          </router-link>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <p class="text-red-400 mb-2">Error loading profile</p>
        <p class="text-gray-400 text-sm mb-4">{{ error }}</p>
        <button @click="loadProfile" class="btn-primary">Try Again</button>
      </div>
    </div>

    <!-- Main content -->
    <main v-else class="flex-1 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- User Profile Card -->
        <div class="card mb-6">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
              {{ userProfile?.avatar_url ? '🖼️' : '👤' }}
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-white mb-2">
                {{ userProfile?.name || 'User' }}
              </h2>
              <p class="text-gray-400 mb-3">
                {{ userProfile?.email || 'No email available' }}
              </p>
              <div class="flex gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-gray-300">Active</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-blue-400">📅</span>
                  <span class="text-gray-300">Joined {{ formatDate(userProfile?.created_at) }}</span>
                </div>
              </div>
            </div>
            <button @click="showEditModal = true" class="btn-secondary">✏️ Edit</button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="card text-center">
            <div class="text-3xl mb-2">✈️</div>
            <div class="text-2xl font-bold text-blue-400">{{ mockStats.trips }}</div>
            <div class="text-gray-400 text-sm">Trips</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">🌍</div>
            <div class="text-2xl font-bold text-green-400">{{ mockStats.countries }}</div>
            <div class="text-gray-400 text-sm">Countries</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">🏨</div>
            <div class="text-2xl font-bold text-purple-400">{{ mockStats.nights }}</div>
            <div class="text-gray-400 text-sm">Nights</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">💰</div>
            <div class="text-2xl font-bold text-yellow-400">€{{ mockStats.spent }}</div>
            <div class="text-gray-400 text-sm">Spent</div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Travel Preferences -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              Travel Preferences
            </h3>
            <div v-if="preferences.length > 0" class="space-y-4">
              <div v-for="pref in preferences" :key="`${pref.type}-${pref.name}`" class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">
                    {{ pref.type === 'Destinos' || pref.type === 'DESTINATION' ? '🏖️' : 
                       pref.type === 'Actividades' || pref.type === 'ACTIVITIES' ? '🎯' : 
                       pref.type === 'Precios' || pref.type === 'PRICE' ? '💰' : 
                       pref.type === 'Alojamientos' || pref.type === 'ACCOMMODATION' ? '🏨' : 
                       pref.type === 'Transportes' || pref.type === 'TRASNPORT' || pref.type === 'TRANSPORT' ? '🚗' : 
                       pref.type === 'Motivaciones' || pref.type === 'MOTIVATION' ? '❤️' : '⭐' }}
                  </span>
                  <div>
                    <span class="text-gray-300 font-medium">{{ pref.name }}</span>
                    <div class="text-xs text-gray-500">{{ pref.type.toLowerCase() }}</div>
                  </div>
                </div>
                <span class="text-blue-400 text-sm">{{ pref.value || pref.name }}</span>
              </div>
              <button @click="showEditPreferencesModal = true" class="w-full btn-secondary text-sm mt-4">
                ✏️ Edit Preferences
              </button>
            </div>
            <div v-else class="text-center py-8">
              <div class="text-gray-500 text-4xl mb-2">🎯</div>
              <p class="text-gray-400">No preferences set yet</p>
              <button @click="showPreferencesModal = true" class="btn-primary mt-2">Add Preferences</button>
            </div>
          </div>

          <!-- Groups -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>�</span>
              My Groups
            </h3>
            <div v-if="userGroups.length > 0" class="space-y-3">
              <div v-for="group in userGroups" :key="group.id" class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  👥
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-white">{{ group.group_name || group.name }}</h4>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="text-gray-500 text-4xl mb-2">👥</div>
              <p class="text-gray-400">No groups found</p>
            </div>
          </div>

          <!-- Settings -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>⚙️</span>
              Settings
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-gray-300">Profile visibility</span>
                  <p class="text-gray-500 text-xs">Control who can see your profile</p>
                </div>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-gray-300">Email notifications</span>
                  <p class="text-gray-500 text-xs">Receive updates about your trips</p>
                </div>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-gray-300">AI recommendations</span>
                  <p class="text-gray-500 text-xs">Get personalized travel suggestions</p>
                </div>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-gray-300">Dark mode</span>
                  <p class="text-gray-500 text-xs">Toggle dark/light theme</p>
                </div>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Insights -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🤖</span>
              AI Insights
            </h3>
            <div class="space-y-4">
              <div v-for="insight in mockAiInsights" :key="insight.id" class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">{{ insight.icon }}</span>
                  <div class="flex-1">
                    <h4 class="font-medium text-blue-400 mb-2">{{ insight.title }}</h4>
                    <p class="text-gray-300 text-sm">{{ insight.message }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs text-gray-500">{{ insight.confidence }}% confidence</span>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">{{ insight.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button class="w-full btn-secondary text-sm mt-4">
                🔄 Generate New Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Edit Profile</h3>
        <form @submit.prevent="updateProfile">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input v-model="editForm.name" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input v-model="editForm.email" type="email" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Avatar URL (optional)</label>
              <input v-model="editForm.avatar_url" type="url" class="input-field" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="button" @click="showEditModal = false" class="btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn-primary flex-1">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Preferences Modal -->
    <div v-if="showEditPreferencesModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Edit Preferences</h3>
        <div class="text-gray-400 text-sm mb-4">
          Your preferences have been loaded. To make changes, please use the main preferences form.
        </div>
        <div class="flex gap-3">
          <button @click="showEditPreferencesModal = false" class="btn-secondary flex-1">Close</button>
          <router-link to="/profile" class="btn-primary flex-1 text-center">Update Preferences</router-link>
        </div>
      </div>
    </div>
    <div v-if="showPreferencesModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Add Travel Preferences</h3>
        <form @submit.prevent="addPreference">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Preference Type</label>
              <select v-model="preferenceForm.type" class="input-field" required>
                <option value="food">Food</option>
                <option value="hotel">Hotel</option>
                <option value="transport">Transport</option>
                <option value="budget">Budget</option>
                <option value="activities">Activities</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Value</label>
              <input v-model="preferenceForm.value" type="text" class="input-field" required />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="button" @click="showPreferencesModal = false" class="btn-secondary flex-1">Cancel</button>
            <button type="submit" class="btn-primary flex-1">Add Preference</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { preferencesService } from '@/services/preferencesService'
import { groupService } from '@/services/groupService'

// Store
const authStore = useAuthStore()

// State
const loading = ref(true)
const error = ref(null)
const userProfile = ref(null)
const preferences = ref([])
const userGroups = ref([])

// Mock data for display purposes
const mockStats = ref({
  trips: 12,
  countries: 8,
  nights: 45,
  spent: 3450
})

const mockAiInsights = ref([
  {
    id: 1,
    icon: "🎯",
    title: "Travel Style Match",
    message: "Based on your preferences, you love cultural experiences and city exploration. Consider visiting Vienna or Prague for your next adventure!",
    confidence: 92,
    date: "2 days ago"
  },
  {
    id: 2,
    icon: "💰",
    title: "Budget Optimization",
    message: "You could save 15% on accommodations by booking 3 weeks in advance instead of 1 week. Your spending pattern shows you prefer mid-range hotels.",
    confidence: 87,
    date: "1 week ago"
  },
  {
    id: 3,
    icon: "🗓️",
    title: "Best Travel Time",
    message: "Your travel history suggests you prefer shoulder seasons. April-May and September-October would be perfect for your next European trip.",
    confidence: 94,
    date: "3 days ago"
  }
])

// Modals
const showEditModal = ref(false)
const showPreferencesModal = ref(false)
const showEditPreferencesModal = ref(false)

// Forms
const editForm = ref({
  name: '',
  email: '',
  avatar_url: ''
})

const preferenceForm = ref({
  type: 'food',
  value: ''
})

// Computed
const currentUser = computed(() => authStore.currentUser)

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Load user profile - use the current user from auth store first
    if (currentUser.value) {
      userProfile.value = currentUser.value
      
      // Set edit form with current user data
      editForm.value = {
        name: currentUser.value.name || '',
        email: currentUser.value.email || '',
        avatar_url: currentUser.value.avatar_url || ''
      }
      
      console.log('Current user profile loaded:', userProfile.value)
    }

    // Try to get additional user details from API if needed
    if (currentUser.value?.id) {
      try {
        const detailedProfile = await userService.getUserById(currentUser.value.id)
        console.log('Detailed profile from API:', detailedProfile)
        
        // Merge API data with current user data
        userProfile.value = {
          ...userProfile.value,
          ...detailedProfile
        }
        
        // Update edit form with API data
        editForm.value = {
          name: detailedProfile.name || userProfile.value.name || '',
          email: detailedProfile.email || userProfile.value.email || '',
          avatar_url: detailedProfile.avatar_url || userProfile.value.avatar_url || ''
        }
      } catch (apiError) {
        console.log('Could not fetch detailed profile from API, using auth store data:', apiError.message)
      }
    }

    // Load user preferences
    if (currentUser.value?.id) {
      try {
        const userPreferences = await preferencesService.getUserPreferencesById(currentUser.value.id)
        console.log('User preferences loaded:', userPreferences)
        
        // Parse new preferences data structure (with keys like "Destinos", "Actividades", etc.)
        if (userPreferences && userPreferences.data && Array.isArray(userPreferences.data)) {
          // Each preference object has keys like "Destinos", "Actividades", etc.
          const processedPreferences = []
          
          userPreferences.data.forEach(prefObj => {
            Object.keys(prefObj).forEach(key => {
              if (key !== 'id' && key !== 'user_id' && key !== 'name_user') {
                const values = prefObj[key]
                if (Array.isArray(values)) {
                  values.forEach(value => {
                    processedPreferences.push({
                      name: value,
                      type: key,
                      value: value
                    })
                  })
                }
              }
            })
          })
          
          preferences.value = processedPreferences
        } else if (userPreferences && userPreferences.preferences && Array.isArray(userPreferences.preferences)) {
          // Fallback to old structure
          preferences.value = userPreferences.preferences.map(pref => ({
            name: pref.name,
            type: pref.type,
            value: pref.name // Use name as value for display
          }))
        } else if (userPreferences && Array.isArray(userPreferences)) {
          // Another fallback structure
          preferences.value = userPreferences.map(pref => ({
            name: pref.name,
            type: pref.type,
            value: pref.name
          }))
        } else {
          preferences.value = []
        }
        
        console.log('Processed preferences:', preferences.value)
      } catch (preferencesError) {
        console.log('No preferences found or error loading preferences:', preferencesError.message)
        preferences.value = []
      }
    }

    // Load user groups
    if (currentUser.value?.id) {
      try {
        const userGroupsData = await groupService.getGroupsByUser(currentUser.value.id)
        console.log('User groups loaded:', userGroupsData)
        
        // Parse groups data structure
        if (userGroupsData && Array.isArray(userGroupsData)) {
          userGroups.value = userGroupsData
        } else if (userGroupsData && userGroupsData.data && Array.isArray(userGroupsData.data)) {
          userGroups.value = userGroupsData.data
        } else {
          userGroups.value = []
        }
        
        console.log('Processed groups:', userGroups.value)
      } catch (groupsError) {
        console.log('No groups found or error loading groups:', groupsError.message)
        userGroups.value = []
      }
    }

    console.log('Profile loading completed successfully')

  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.response?.data?.detail || err.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    if (currentUser.value?.id) {
      console.log('Updating profile with data:', editForm.value)
      
      const updatedProfile = await userService.updateUser(currentUser.value.id, editForm.value)
      console.log('Profile updated successfully:', updatedProfile)
      
      // Update local state
      userProfile.value = updatedProfile
      
      // Update auth store with new user data
      authStore.updateUser(updatedProfile)
      
      showEditModal.value = false
      
      // Show success message (you could add a toast notification here)
      console.log('Profile updated successfully!')
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err.response?.data?.detail || err.message || 'Failed to update profile'
  }
}

const addPreference = async () => {
  try {
    if (currentUser.value?.id) {
      // For now, we'll just add to local state since we need a group_id
      // In a real app, you would create preferences for a specific group
      const newPreference = {
        name: preferenceForm.value.type,
        type: preferenceForm.value.type,
        value: preferenceForm.value.value
      }
      
      preferences.value.push(newPreference)
      showPreferencesModal.value = false
      preferenceForm.value = { type: 'food', value: '' }
    }
  } catch (err) {
    console.error('Error adding preference:', err)
    error.value = err.response?.data?.detail || 'Failed to add preference'
  }
}

// Lifecycle
onMounted(() => {
  console.log('Profile component mounted')
  console.log('Current user from auth store:', currentUser.value)
  
  if (!currentUser.value) {
    console.log('No current user found, user might need to login')
    error.value = 'Please log in to view your profile'
    loading.value = false
    return
  }
  
  loadProfile()
})
</script> 