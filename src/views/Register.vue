<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-4xl font-bold text-white mb-2">Join Travel ProSus</h2>
        <p class="text-gray-300">Create your account and start planning amazing trips</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <!-- Name Field -->
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-200 mb-2">
            Full Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
            :disabled="loading"
          />
        </div>

        <!-- Email Field -->
        <div class="mb-6">
          <label for="email" class="block text-sm font-medium text-gray-200 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-200 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your password (min 6 characters)"
            :disabled="loading"
          />
        </div>

        <!-- Confirm Password Field -->
        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-200 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Confirm your password"
            :disabled="loading"
          />
          <p v-if="passwordMismatch" class="text-red-400 text-sm mt-1">
            Passwords do not match
          </p>
        </div>

        <!-- Avatar URL Field (Optional) -->
        <div class="mb-6">
          <label for="avatarUrl" class="block text-sm font-medium text-gray-200 mb-2">
            Avatar URL (Optional)
          </label>
          <input
            id="avatarUrl"
            v-model="form.avatar_url"
            type="url"
            class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="https://example.com/avatar.jpg"
            :disabled="loading"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p class="text-green-300 text-sm">{{ success }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || passwordMismatch"
          class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
          <span v-else>Create Account</span>
        </button>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-300">
            Already have an account?
            <router-link to="/login" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
    </div>

    <!-- Preferences Form Modal -->
    <PreferencesForm
      v-if="showPreferencesForm"
      :user-id="registeredUser?.id"
      :user-name="registeredUser?.name"
      @saved="handlePreferencesSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PreferencesForm from '@/components/PreferencesForm.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar_url: ''
})

// Local state
const success = ref('')
const registeredUser = ref(null)
const showPreferencesForm = ref(false)

// Computed properties
const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)
const passwordMismatch = computed(() => 
  form.password && form.confirmPassword && form.password !== form.confirmPassword
)

// Methods
const handleRegister = async () => {
  if (passwordMismatch.value) {
    return
  }

  const userData = {
    name: form.name,
    email: form.email,
    password: form.password,
    avatar_url: form.avatar_url || undefined
  }

  const result = await authStore.register(userData)
  
  if (result.success) {
    success.value = 'Account created successfully! Please set up your travel preferences.'
    registeredUser.value = result.user
    showPreferencesForm.value = true
    
    // Clear form
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatar_url: ''
    })
  }
}

const handlePreferencesSaved = () => {
  showPreferencesForm.value = false
  success.value = 'Account created and preferences saved! Redirecting to home...'
  
  // Redirect to home after 2 seconds
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
</script> 