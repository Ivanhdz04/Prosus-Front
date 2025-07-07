<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="glass-effect p-4 border-b border-gray-700">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/group-chat" class="text-2xl">💬</router-link>
          <div>
            <h1 class="text-xl font-bold text-white">Travel Planner</h1>
            <p class="text-gray-400 text-sm">AI-powered group preferences & recommendations</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/booking" class="btn-primary text-sm">
            🎯 Go to Booking
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- AI Summary Card -->
        <div class="card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 class="font-semibold text-white">AI Analysis Summary</h3>
              <p class="text-gray-400 text-sm">Based on your group conversations</p>
            </div>
          </div>
          <div class="bg-gray-700/50 rounded-xl p-4">
            <p class="text-gray-300">
              Based on your group's preferences, I recommend <strong class="text-blue-400">Barcelona</strong> 
              with a budget of <strong class="text-green-400">€800-1200</strong> per person. 
              Your group shows interest in cultural activities and local cuisine.
            </p>
          </div>
        </div>

        <!-- Preferences Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Destination -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">🌍</div>
              <h3 class="font-semibold text-white">Destination</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">Barcelona, Spain</span>
                <span class="text-green-400 text-sm">✓ Consensus</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">Madrid, Spain</span>
                <span class="text-yellow-400 text-sm">Under discussion</span>
              </div>
            </div>
          </div>

          <!-- Budget -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">💰</div>
              <h3 class="font-semibold text-white">Budget</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">€800 - €1200</span>
                <span class="text-green-400 text-sm">✓ Consensus</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">4 people</span>
                <span class="text-blue-400 text-sm">Group size</span>
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">📅</div>
              <h3 class="font-semibold text-white">Dates</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">June 15-22, 2024</span>
                <span class="text-green-400 text-sm">✓ Consensus</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">7 days</span>
                <span class="text-blue-400 text-sm">Duration</span>
              </div>
            </div>
          </div>

          <!-- Activities -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">🎯</div>
              <h3 class="font-semibold text-white">Activities</h3>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                <span class="text-green-400">✓</span>
                <span class="text-gray-300">Sagrada Familia Visit</span>
              </div>
              <div class="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                <span class="text-green-400">✓</span>
                <span class="text-gray-300">Gothic Quarter Tour</span>
              </div>
              <div class="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                <span class="text-yellow-400">○</span>
                <span class="text-gray-300">Boat ride</span>
              </div>
              <div class="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                <span class="text-yellow-400">○</span>
                <span class="text-gray-300">Local restaurant dinner</span>
              </div>
            </div>
          </div>

          <!-- Accommodation -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">🏨</div>
              <h3 class="font-semibold text-white">Accommodation</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">Central hotel</span>
                <span class="text-green-400 text-sm">✓ Preferred</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">€80-120/night</span>
                <span class="text-blue-400 text-sm">Range</span>
              </div>
            </div>
          </div>

          <!-- Transport -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-2xl">🚇</div>
              <h3 class="font-semibold text-white">Transport</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">Metro + Walking</span>
                <span class="text-green-400 text-sm">✓ Preferred</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span class="text-gray-300">Bicycles</span>
                <span class="text-yellow-400 text-sm">Optional</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button class="btn-primary flex items-center gap-2">
            <span>🤖</span>
            Ask AI for Suggestions
          </button>
          <router-link to="/booking" class="btn-success flex items-center gap-2">
            <span>🎯</span>
            Proceed to Booking
          </router-link>
          <button class="btn-secondary flex items-center gap-2">
            <span>📝</span>
            Edit Preferences
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'

export default {
  name: 'TravelPlanner',
  setup() {
    const chatStore = useChatStore()
    
    return {
      travelPreferences: chatStore.getTravelPreferences
    }
  }
}
</script> 