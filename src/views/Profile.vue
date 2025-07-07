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
            <div class="text-2xl font-bold text-blue-400">{{ stats.trips || 0 }}</div>
            <div class="text-gray-400 text-sm">Trips</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">🌍</div>
            <div class="text-2xl font-bold text-green-400">{{ stats.countries || 0 }}</div>
            <div class="text-gray-400 text-sm">Countries</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">🏨</div>
            <div class="text-2xl font-bold text-purple-400">{{ stats.nights || 0 }}</div>
            <div class="text-gray-400 text-sm">Nights</div>
          </div>
          <div class="card text-center">
            <div class="text-3xl mb-2">💰</div>
            <div class="text-2xl font-bold text-yellow-400">€{{ stats.spent || 0 }}</div>
            <div class="text-gray-400 text-sm">Spent</div>
          </div>
        </div>

        <!-- Preferences Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Travel Preferences -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              Travel Preferences
            </h3>
            <div v-if="preferences.length > 0" class="space-y-4">
              <div v-for="pref in preferences" :key="pref.name" class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">{{ pref.name }}</span>
                <span class="text-blue-400">{{ pref.value || 'Not set' }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="text-gray-500 text-4xl mb-2">🎯</div>
              <p class="text-gray-400">No preferences set yet</p>
              <button @click="showPreferencesModal = true" class="btn-primary mt-2">Add Preferences</button>
            </div>
          </div>

          <!-- Recent Trips -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>📅</span>
              Recent Trips
            </h3>
            <div v-if="recentTrips.length > 0" class="space-y-3">
              <div v-for="trip in recentTrips" :key="trip.id" class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  🌍
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-white">{{ trip.destination }}</h4>
                  <p class="text-gray-400 text-sm">
                    {{ formatDate(trip.start_date) }} • {{ calculateDays(trip.start_date, trip.end_date) }} days
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-green-400 font-semibold">{{ trip.status ? 'Active' : 'Completed' }}</div>
                  <div class="text-gray-400 text-sm">{{ formatDate(trip.created_at) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="text-gray-500 text-4xl mb-2">✈️</div>
              <p class="text-gray-400">No trips yet</p>
              <router-link to="/group-chat" class="btn-primary mt-2">Start Planning</router-link>
            </div>
          </div>

          <!-- AI Insights -->
          <div class="card">
            <h3 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🤖</span>
              AI Insights
            </h3>
            <div v-if="aiInsights.length > 0" class="space-y-4">
              <div v-for="insight in aiInsights" :key="insight.id" class="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <h4 class="font-medium text-blue-400 mb-2">{{ insight.title }}</h4>
                <p class="text-gray-300 text-sm">{{ insight.message }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="text-gray-500 text-4xl mb-2">🤖</div>
              <p class="text-gray-400">No AI insights yet</p>
              <p class="text-gray-500 text-sm">Start chatting to get personalized recommendations</p>
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
                <span class="text-gray-300">Profile visibility</span>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Email notifications</span>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">AI recommendations</span>
                <div class="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
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

    <!-- Add Preferences Modal -->
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
import { tripService } from '@/services/tripService'
import { preferencesService } from '@/services/preferencesService'

// Store
const authStore = useAuthStore()

// State
const loading = ref(true)
const error = ref(null)
const userProfile = ref(null)
const recentTrips = ref([])
const preferences = ref([])
const aiInsights = ref([])
const stats = ref({
  trips: 0,
  countries: 0,
  nights: 0,
  spent: 0
})

// Modals
const showEditModal = ref(false)
const showPreferencesModal = ref(false)

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

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Load user profile
    if (currentUser.value?.id) {
      const profile = await userService.getUserById(currentUser.value.id)
      userProfile.value = profile
      
      // Set edit form
      editForm.value = {
        name: profile.name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || ''
      }
    }

    // Load user trips
    if (currentUser.value?.id) {
      const trips = await tripService.getTrips()
      recentTrips.value = trips.slice(0, 3) // Get last 3 trips
      stats.value.trips = trips.length
    }

    // Load user preferences (we'll get them from the user's groups)
    if (currentUser.value?.id) {
      try {
        // For now, we'll show empty preferences since we need a group_id
        // In a real app, you might want to get preferences from the user's active group
        preferences.value = []
      } catch (err) {
        console.log('No preferences found')
        preferences.value = []
      }
    }

    // Calculate stats (mock for now)
    stats.value.countries = recentTrips.value.length
    stats.value.nights = recentTrips.value.reduce((total, trip) => {
      return total + calculateDays(trip.start_date, trip.end_date)
    }, 0)
    stats.value.spent = recentTrips.value.length * 1000 // Mock calculation

  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.response?.data?.detail || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    if (currentUser.value?.id) {
      const updatedProfile = await userService.updateUser(currentUser.value.id, editForm.value)
      userProfile.value = updatedProfile
      authStore.updateUser(updatedProfile)
      showEditModal.value = false
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err.response?.data?.detail || 'Failed to update profile'
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
  loadProfile()
})
</script> 