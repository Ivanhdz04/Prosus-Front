<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Tell Us About Your Travel Preferences</h2>
        <p class="text-gray-300">Help us personalize your travel experience</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between text-sm text-gray-300 mb-2">
          <span>Step {{ currentStep }} of {{ totalSteps }}</span>
          <span>{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: Destinations -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">1. What type of destinations do you prefer?</h3>
          <div class="grid grid-cols-2 gap-3">
            <label 
              v-for="destination in destinations" 
              :key="destination"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedDestinations.includes(destination) }"
            >
              <input
                type="checkbox"
                :value="destination"
                v-model="selectedDestinations"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ destination }}</div>
              <div v-if="selectedDestinations.includes(destination)" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Activities -->
        <div v-if="currentStep === 2" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">2. What activities do you enjoy during trips?</h3>
          <div class="grid grid-cols-2 gap-3">
            <label 
              v-for="activity in activities" 
              :key="activity"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedActivities.includes(activity) }"
            >
              <input
                type="checkbox"
                :value="activity"
                v-model="selectedActivities"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ activity }}</div>
              <div v-if="selectedActivities.includes(activity)" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 3: Price Level -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">3. What comfort level do you prefer?</h3>
          <div class="space-y-3">
            <label 
              v-for="price in prices" 
              :key="price"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedPrice === price }"
            >
              <input
                type="radio"
                :value="price"
                v-model="selectedPrice"
                name="price"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ price }}</div>
              <div v-if="selectedPrice === price" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 4: Accommodation -->
        <div v-if="currentStep === 4" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">4. What type of accommodation do you prefer?</h3>
          <div class="grid grid-cols-2 gap-3">
            <label 
              v-for="accommodation in accommodations" 
              :key="accommodation"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedAccommodations.includes(accommodation) }"
            >
              <input
                type="checkbox"
                :value="accommodation"
                v-model="selectedAccommodations"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ accommodation }}</div>
              <div v-if="selectedAccommodations.includes(accommodation)" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 5: Transportation -->
        <div v-if="currentStep === 5" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">5. What means of transportation do you prefer?</h3>
          <div class="grid grid-cols-2 gap-3">
            <label 
              v-for="transport in transports" 
              :key="transport"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedTransports.includes(transport) }"
            >
              <input
                type="checkbox"
                :value="transport"
                v-model="selectedTransports"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ transport }}</div>
              <div v-if="selectedTransports.includes(transport)" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 6: Motivation -->
        <div v-if="currentStep === 6" class="space-y-4">
          <h3 class="text-xl font-semibold text-white mb-4">6. What is your main motivation for traveling?</h3>
          <div class="space-y-3">
            <label 
              v-for="motivation in motivations" 
              :key="motivation"
              class="flex items-center p-4 bg-white/5 border border-gray-600 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
              :class="{ 'border-purple-500 bg-purple-500/20': selectedMotivations.includes(motivation) }"
            >
              <input
                type="checkbox"
                :value="motivation"
                v-model="selectedMotivations"
                class="sr-only"
              />
              <div class="flex-1 text-white">{{ motivation }}</div>
              <div v-if="selectedMotivations.includes(motivation)" class="text-purple-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6">
          <button
            type="button"
            @click="previousStep"
            v-if="currentStep > 1"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <div v-else></div>

          <button
            type="button"
            @click="nextStep"
            v-if="currentStep < totalSteps"
            :disabled="!canProceed"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

          <button
            type="submit"
            v-if="currentStep === totalSteps"
            :disabled="!canProceed || loading"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { preferencesService } from '@/services/preferencesService'

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

// Form data
const selectedDestinations = ref([])
const selectedActivities = ref([])
const selectedPrice = ref('')
const selectedAccommodations = ref([])
const selectedTransports = ref([])
const selectedMotivations = ref([])

// UI state
const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

// Options
const destinations = ['Playa', 'Montaña', 'Ciudad', 'Naturaleza', 'Lugares históricos']
const activities = ['Museos y cultura', 'Senderismo', 'Vida nocturna', 'Compras', 'Gastronomía']
const prices = ['Económico', 'Estándar', 'Lujo']
const accommodations = ['Hotel', 'Airbnb', 'Hostal', 'Resort']
const transports = ['Avión', 'Tren', 'Auto', 'Autobús']
const motivations = ['Placer', 'Trabajo', 'Familia', 'Aventura']

const totalSteps = 6

// Computed properties
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedDestinations.value.length > 0
    case 2:
      return selectedActivities.value.length > 0
    case 3:
      return selectedPrice.value !== ''
    case 4:
      return selectedAccommodations.value.length > 0
    case 5:
      return selectedTransports.value.length > 0
    case 6:
      return selectedMotivations.value.length > 0
    default:
      return false
  }
})

// Methods
const nextStep = () => {
  if (canProceed.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  if (!canProceed.value) return

  loading.value = true
  error.value = ''

  try {
    // Use the userName prop directly instead of making an API call
    if (!props.userName) {
      throw new Error('User name is required to save preferences.')
    }

    // Build preferences object with the prop userName
    const preferencesData = {
      user_id: props.userId,
      name_user: props.userName, // Use the userName prop
      preferences: [
        ...selectedDestinations.value.map(dest => ({ name: dest, type: 'DESTINATION' })),
        ...selectedActivities.value.map(act => ({ name: act, type: 'ACTIVITIES' })),
        ...selectedPrice.value ? [{ name: selectedPrice.value, type: 'PRICE' }] : [],
        ...selectedAccommodations.value.map(acc => ({ name: acc, type: 'ACCOMMODATION' })),
        ...selectedTransports.value.map(trans => ({ name: trans, type: 'TRASNPORT' })), // Using TRASNPORT to match backend expectation
        ...selectedMotivations.value.map(mot => ({ name: mot, type: 'MOTIVATION' }))
      ]
    }

    // Validate data structure
    console.log('Validating preferences data structure...')
    console.log('User ID:', preferencesData.user_id)
    console.log('User Name:', preferencesData.name_user)
    console.log('Preferences count:', preferencesData.preferences.length)
    console.log('Full data structure:', JSON.stringify(preferencesData, null, 2))

    // Check if preferences array is not empty
    if (preferencesData.preferences.length === 0) {
      throw new Error('At least one preference must be selected.')
    }

    // Validate each preference has required fields
    for (const pref of preferencesData.preferences) {
      if (!pref.name || !pref.type) {
        throw new Error(`Invalid preference structure: ${JSON.stringify(pref)}`)
      }
    }

    console.log('Saving preferences data:', preferencesData)
    const result = await preferencesService.createUserPreferences(preferencesData)
    console.log('Preferences saved successfully:', result)
    
    emit('saved')
  } catch (err) {
    console.error('Error saving preferences:', err)
    
    // Provide more specific error messages
    if (err.code === 'ERR_NETWORK') {
      error.value = 'Network error. Please check your connection and try again.'
    } else if (err.response?.status === 400) {
      error.value = `Bad request: ${err.response?.data?.detail || 'Invalid data format'}`
    } else if (err.response?.status === 404) {
      error.value = 'API endpoint not found. Please contact support.'
    } else if (err.response?.status >= 500) {
      error.value = 'Server error. Please try again later.'
    } else {
      error.value = err.message || 'Error saving preferences. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>