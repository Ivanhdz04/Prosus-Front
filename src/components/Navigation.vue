<template>
  <nav class="glass-effect border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="text-2xl">✈️</div>
            <div>
              <h1 class="text-xl font-bold text-white">Travel Buddies</h1>
              <p class="text-gray-400 text-xs">AI-Powered Group Travel</p>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              class="nav-link"
              :class="{ 'active': $route.path === item.href }"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- User Info -->
          <div v-if="currentUser" class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-white">{{ currentUser.name }}</p>
              <p class="text-xs text-gray-400">{{ currentUser.email }}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ currentUser.name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
          </div>

          <!-- Logout Button -->
          <button
            v-if="currentUser"
            @click="handleLogout"
            :disabled="loading"
            class="btn-secondary text-sm"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging out...
            </span>
            <span v-else>Logout</span>
          </button>

          <!-- Login/Register Links -->
          <div v-else class="flex items-center space-x-3">
            <router-link to="/login" class="btn-secondary text-sm">
              Login
            </router-link>
            <router-link to="/register" class="btn-primary text-sm">
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden">
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="text-gray-400 hover:text-white focus:outline-none focus:text-white"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          class="mobile-nav-link"
          :class="{ 'active': $route.path === item.href }"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const mobileMenuOpen = ref(false)

// Computed
const currentUser = computed(() => authStore.currentUser)
const loading = computed(() => authStore.loading)

// Navigation items
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Group Chat', href: '/group-chat' },
  { name: 'Travel Planner', href: '/travel-planner' },
  { name: 'Booking', href: '/booking' },
  { name: 'Profile', href: '/profile' }
]

// Methods
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors;
}

.nav-link.active {
  @apply text-white bg-gray-700;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors;
}

.mobile-nav-link.active {
  @apply text-white bg-gray-700;
}
</style> 