<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
    
    <!-- Global Preferences Form Modal -->
    <PreferencesForm
      v-if="authStore.showPreferencesForm"
      :user-id="authStore.user?.id"
      :user-name="authStore.user?.name"
      @saved="handlePreferencesSaved"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PreferencesForm from '@/components/PreferencesForm.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})

const handlePreferencesSaved = () => {
  authStore.hidePreferencesForm()
}
</script> 