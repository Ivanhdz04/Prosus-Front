<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="glass-effect p-4 border-b border-gray-700">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/travel-planner" class="text-2xl">📋</router-link>
          <div>
            <h1 class="text-xl font-bold text-white">Travel Bookings</h1>
            <p class="text-gray-400 text-sm">Flights, hotels & activities</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-lg font-bold text-green-400">€1,245</div>
            <div class="text-gray-400 text-sm">Estimated total</div>
          </div>
          <router-link to="/profile" class="btn-secondary text-sm">
            👤 Profile
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- Progress indicator -->
        <div class="card mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-white">Booking Progress</h3>
            <span class="text-blue-400">75% Complete</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
          </div>
          <div class="flex justify-between mt-2 text-sm text-gray-400">
            <span>✓ Flights</span>
            <span>✓ Hotel</span>
            <span>○ Activities</span>
            <span>○ Confirmation</span>
          </div>
        </div>

        <!-- Booking sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Flights -->
          <div class="lg:col-span-2">
            <div class="card mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-2xl">✈️</div>
                <h3 class="font-semibold text-white">Selected Flights</h3>
              </div>
              
              <div v-if="selectedFlight" class="space-y-4">
                <div class="bg-gray-700/50 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        ✈️
                      </div>
                      <div>
                        <div class="font-semibold text-white">{{ selectedFlight.airline }}</div>
                        <div class="text-gray-400 text-sm">{{ selectedFlight.flightNumber }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-green-400">€{{ selectedFlight.price }}</div>
                      <div class="text-gray-400 text-sm">{{ selectedFlight.duration }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="text-center">
                      <div class="font-semibold text-white">{{ selectedFlight.departureTime }}</div>
                      <div class="text-gray-400 text-sm">{{ selectedFlight.departure }}</div>
                    </div>
                    <div class="flex-1 mx-4">
                      <div class="border-t border-gray-600 relative">
                        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-white">{{ selectedFlight.arrivalTime }}</div>
                      <div class="text-gray-400 text-sm">{{ selectedFlight.arrival }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8">
                <div class="text-4xl mb-4">✈️</div>
                <p class="text-gray-400 mb-4">No flights selected</p>
                <button class="btn-primary">Search Flights</button>
              </div>
            </div>

            <!-- Hotels -->
            <div class="card">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-2xl">🏨</div>
                <h3 class="font-semibold text-white">Selected Hotel</h3>
              </div>
              
              <div v-if="selectedHotel" class="space-y-4">
                <div class="bg-gray-700/50 rounded-xl p-4">
                  <div class="flex gap-4">
                    <img :src="selectedHotel.image" :alt="selectedHotel.name" 
                         class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1">
                      <h4 class="font-semibold text-white mb-1">{{ selectedHotel.name }}</h4>
                      <p class="text-gray-400 text-sm mb-2">{{ selectedHotel.location }}</p>
                      <div class="flex items-center gap-2 mb-2">
                        <div class="flex text-yellow-400">
                          <span v-for="i in 5" :key="i" class="text-sm">
                            {{ i <= Math.floor(selectedHotel.rating) ? '★' : '☆' }}
                          </span>
                        </div>
                        <span class="text-gray-400 text-sm">{{ selectedHotel.rating }}</span>
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="amenity in selectedHotel.amenities" :key="amenity"
                              class="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                          {{ amenity }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-green-400">€{{ selectedHotel.price }}/night</div>
                      <div class="text-gray-400 text-sm">3 nights</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8">
                <div class="text-4xl mb-4">🏨</div>
                <p class="text-gray-400 mb-4">No hotel selected</p>
                <button class="btn-primary">Search Hotels</button>
              </div>
            </div>
          </div>

          <!-- Activities & Summary -->
          <div class="space-y-6">
            <!-- Activities -->
            <div class="card">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-2xl">🎯</div>
                <h3 class="font-semibold text-white">Activities</h3>
              </div>
              
              <div v-if="selectedActivities.length > 0" class="space-y-3">
                <div v-for="activity in selectedActivities" :key="activity.id"
                     class="bg-gray-700/50 rounded-lg p-3">
                  <div class="flex gap-3">
                    <img :src="activity.image" :alt="activity.name" 
                         class="w-12 h-12 rounded object-cover">
                    <div class="flex-1">
                      <h4 class="font-medium text-white text-sm">{{ activity.name }}</h4>
                      <p class="text-gray-400 text-xs">{{ activity.duration }}</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-green-400 text-sm">€{{ activity.price }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-6">
                <div class="text-2xl mb-2">🎯</div>
                <p class="text-gray-400 text-sm mb-3">No activities selected</p>
                <button class="btn-secondary text-sm">Explore Activities</button>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="card">
              <h3 class="font-semibold text-white mb-4">Booking Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Flights</span>
                  <span class="text-white">€{{ selectedFlight?.price || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Hotel (3 nights)</span>
                  <span class="text-white">€{{ (selectedHotel?.price || 0) * 3 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Activities</span>
                  <span class="text-white">€{{ activitiesTotal }}</span>
                </div>
                <div class="border-t border-gray-700 pt-3">
                  <div class="flex justify-between font-semibold">
                    <span class="text-white">Total</span>
                    <span class="text-green-400">€{{ totalPrice }}</span>
                  </div>
                </div>
              </div>
              
              <button class="btn-success w-full mt-6">
                🎯 Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useBookingStore } from '../stores/booking'

export default {
  name: 'Booking',
  setup() {
    const bookingStore = useBookingStore()
    
    const selectedFlight = computed(() => bookingStore.getSelectedFlight)
    const selectedHotel = computed(() => bookingStore.getSelectedHotel)
    const selectedActivities = computed(() => bookingStore.getSelectedActivities)
    const totalPrice = computed(() => bookingStore.getTotalPrice)
    
    const activitiesTotal = computed(() => {
      return selectedActivities.value.reduce((sum, activity) => sum + activity.price, 0)
    })
    
    return {
      selectedFlight,
      selectedHotel,
      selectedActivities,
      totalPrice,
      activitiesTotal
    }
  }
}
</script> 