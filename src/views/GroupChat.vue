<template>
  <div class="chat-main-container bg-gray-900 flex flex-col">
    <!-- Group Selection Modal -->
    <div v-if="showGroupSelection" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold text-white mb-4">Seleccionar Grupo</h2>
        <p class="text-gray-400 mb-4">Tienes {{ availableGroups.length }} grupos disponibles. Selecciona uno para continuar:</p>
        
        <div class="space-y-3">
          <div v-for="group in availableGroups" :key="group.id" 
               class="p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
               @click="selectGroup(group)">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-white">{{ group.name }}</h3>
                <p class="text-sm text-gray-400">{{ group.description || 'Sin descripción' }}</p>
              </div>
              <span class="text-blue-400">→</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex gap-3">
          <button @click="createNewGroup" class="btn-secondary flex-1">
            Crear Nuevo Grupo
          </button>
          <button @click="goBack" class="btn-primary flex-1">
            Volver
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-white">Cargando grupos...</p>
      </div>
    </div>

    <!-- Main Chat Interface -->
    <div v-if="!showGroupSelection && !isLoading && selectedGroup" class="flex flex-col h-screen">
      <!-- Header -->
      <header class="glass-effect p-4 border-b border-gray-700 flex-shrink-0">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-2xl">🏠</router-link>
            <div>
              <h1 class="text-xl font-bold text-white">{{ selectedGroup.name }}</h1>
              <p class="text-gray-400 text-sm">
                <span :class="websocketStatus === 'connected' ? 'text-green-400' : 'text-red-400'">
                  {{ websocketStatus === 'connected' ? '🟢 Conectado' : '🔴 Desconectado' }}
                </span>
                • {{ onlineMembers }} {{ onlineMembers === 1 ? 'miembro' : 'miembros' }} en línea
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div v-for="member in groupMembers" :key="member.id" 
                   class="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-sm font-medium"
                   :class="member.color">
                {{ member.avatar }}
              </div>
            </div>
            <router-link to="/travel-planner" class="btn-secondary text-sm">
              📋 Planner
            </router-link>
          </div>
        </div>
      </header>

      <!-- Main chat area -->
      <main class="chat-content flex flex-1">
        <!-- AI Assistant Panel (Left) -->
        <div class="w-3/4 border-r border-gray-700 chat-panel">
          <div class="p-4 border-b border-gray-700 bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h2 class="font-semibold text-white">AI Travel Assistant</h2>
                <p class="text-gray-400 text-sm">Analyzing your group preferences</p>
              </div>
            </div>
          </div>

          <!-- AI Chat Messages -->
          <div ref="aiChatContainer" class="chat-messages-area p-4">
            <div class="space-y-4">
              <!-- Welcome message -->
              <div class="flex justify-center">
                <div class="card text-center max-w-md">
                  <div class="text-3xl mb-2">🤖</div>
                  <h3 class="font-semibold mb-2">Hello! I'm your AI travel assistant</h3>
                  <p class="text-gray-400 text-sm">
                    I'm analyzing your group conversations to provide personalized travel recommendations.
                  </p>
                </div>
              </div>

              <!-- AI Messages -->
              <div v-for="message in aiMessages" :key="message.id" 
                   class="flex justify-start">
                <div class="flex items-end gap-2 max-w-md">
                  <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium mb-1">
                    🤖
                  </div>
                  <div class="chat-bubble chat-bubble-ai">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-sm">AI Assistant</span>
                      <span class="text-xs opacity-70">{{ formatTime(message.created_at || message.timestamp) }}</span>
                    </div>
                    <p>{{ message.message || message.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Typing indicator -->
              <div v-if="isAiTyping" class="flex justify-start">
                <div class="flex items-end gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium mb-1">
                    🤖
                  </div>
                  <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Input -->
          <div class="chat-input-area p-4 border-t border-gray-700 bg-gray-800/50">
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  v-model="aiMessage"
                  @keyup.enter="sendAiMessage"
                  @input="scrollAiToBottom"
                  @focus="scrollAiToBottom"
                  type="text"
                  placeholder="Ask AI about destinations, budgets, or travel tips..."
                  class="input-field pr-12"
                  :disabled="isAiTyping"
                />
                <button
                  @click="sendAiMessage"
                  :disabled="!aiMessage.trim() || isAiTyping"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="text-white">📤</span>
                </button>
              </div>
              <button
                @click="generateAiInsight"
                :disabled="isAiTyping"
                class="btn-primary px-4"
              >
                💡 Insight
              </button>
            </div>
          </div>
        </div>

        <!-- Group Chat Panel (Right) -->
        <div class="w-1/4 chat-panel">
          <div class="p-4 border-b border-gray-700 bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                💬
              </div>
              <div>
                <h2 class="font-semibold text-white">Discusión del Grupo</h2>
                <p class="text-gray-400 text-sm">
                  {{ onlineMembers }} {{ onlineMembers === 1 ? 'miembro' : 'miembros' }} en línea • {{ groupMembers.length }} total
                </p>
              </div>
            </div>
          </div>

          <!-- Group Chat Messages -->
          <div ref="groupChatContainer" class="chat-messages-area p-4">
            <div class="space-y-4">
              <!-- Group Messages -->
              <div v-for="message in groupMessages" :key="message.id" 
                   class="flex" :class="message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'">
                <div class="flex items-end gap-2 max-w-md">
                  <div v-if="message.user_id !== currentUser?.id" 
                       class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1"
                       :class="getUserColor(message.user_id)">
                    {{ getUserAvatar(message.user_id) }}
                  </div>
                  <div class="chat-bubble" :class="message.user_id === currentUser?.id ? 'chat-bubble-user' : 'chat-bubble-group'">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-sm">{{ getUserName(message.user_id) }}</span>
                      <span class="text-xs opacity-70">{{ formatTime(message.created_at || message.timestamp) }}</span>
                    </div>
                    <p>{{ message.message || message.content }}</p>
                  </div>
                  <div v-if="message.user_id === currentUser?.id" 
                       class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1"
                       :class="currentUser?.color || 'bg-blue-500'">
                    {{ currentUser?.avatar || '👤' }}
                  </div>
                </div>
              </div>

              <!-- Group Typing indicator -->
              <div v-if="isGroupTyping" class="flex justify-start">
                <div class="flex items-end gap-2">
                  <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-medium mb-1">
                    💬
                  </div>
                  <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Group Input -->
          <div class="chat-input-area p-4 border-t border-gray-700 bg-gray-800/50">
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  v-model="groupMessage"
                  @keyup.enter="sendGroupMessage"
                  @input="handleGroupTyping"
                  @focus="scrollGroupToBottom"
                  type="text"
                  placeholder="Discute con tu grupo sobre el viaje..."
                  class="input-field pr-12"
                  :disabled="isGroupTyping || websocketStatus !== 'connected'"
                />
                <button
                  @click="sendGroupMessage"
                  :disabled="!groupMessage.trim() || isGroupTyping || websocketStatus !== 'connected'"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="text-white">📤</span>
                </button>
              </div>
              <button
                @click="generateGroupSuggestion"
                :disabled="isGroupTyping"
                class="btn-secondary px-4"
              >
                💭 Suggest
              </button>
            </div>
            
            <!-- Quick actions -->
            <div class="flex gap-2 mt-3 flex-wrap">
              <button
                v-for="action in quickActions"
                :key="action.text"
                @click="sendQuickMessage(action.text)"
                class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                {{ action.text }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { chatService } from '@/services/chatService'
import { groupService } from '@/services/groupService'
import websocketService from '@/services/websocketService'

// Router
const router = useRouter()

// Store
const authStore = useAuthStore()

// Refs
const aiMessage = ref('')
const groupMessage = ref('')
const isAiTyping = ref(false)
const isGroupTyping = ref(false)
const aiChatContainer = ref(null)
const groupChatContainer = ref(null)
const isLoading = ref(true)
const showGroupSelection = ref(false)
const availableGroups = ref([])
const selectedGroup = ref(null)
const websocketStatus = ref('disconnected')

// Current user and group data
const currentUser = computed(() => authStore.currentUser)

// Messages
const aiMessages = ref([])
const groupMessages = ref([])
const groupMembers = ref([])
const onlineMembers = ref(0)

// User colors for avatars
const userColors = {
  'user-1': 'bg-pink-500',
  'user-2': 'bg-blue-500',
  'user-3': 'bg-purple-500',
  'user-4': 'bg-green-500',
  'user-5': 'bg-yellow-500'
}

const userAvatars = {
  'user-1': '👩‍💼',
  'user-2': '👨‍💻',
  'user-3': '👩‍🎨',
  'user-4': '👨‍🏫',
  'user-5': '👩‍⚕️'
}

    const quickActions = [
      { text: 'Where to go?' },
      { text: 'Budget discussion' },
      { text: 'Dates' },
      { text: 'Activities' },
      { text: 'Accommodation' },
      { text: 'Transport' }
    ]

    // Helper functions
    const getUserColor = (userId) => {
      return userColors[userId] || 'bg-gray-500'
    }

    const getUserAvatar = (userId) => {
      return userAvatars[userId] || '👤'
    }

    const getUserName = (userId) => {
      const member = groupMembers.value.find(m => m.id === userId)
      return member?.name || 'Usuario Desconocido'
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // Enhanced scroll to bottom functions
    const scrollToBottom = (container) => {
      if (container) {
        nextTick(() => {
          container.scrollTop = container.scrollHeight
          setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
          setTimeout(() => {
            container.scrollTop = container.scrollHeight
          }, 200)
        })
      }
    }

    const scrollAiToBottom = () => {
      scrollToBottom(aiChatContainer.value)
    }

    const scrollGroupToBottom = () => {
      scrollToBottom(groupChatContainer.value)
    }



// Group selection functions
const loadUserGroups = async () => {
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  try {
    isLoading.value = true
    const groups = await groupService.getGroupsByUser(currentUser.value.id)
    availableGroups.value = groups

    if (groups.length === 0) {
      // No groups available, redirect to create group or home
      router.push('/')
      return
    } else if (groups.length === 1) {
      // Only one group, auto-select it
      selectGroup(groups[0])
    } else {
      // Multiple groups, show selection
      showGroupSelection.value = true
    }
  } catch (error) {
    console.error('Error loading user groups:', error)
    availableGroups.value = [
      { id: 'demo-group-1', name: 'Viaje a Barcelona', description: 'Grupo de viaje a Barcelona' },
      { id: 'demo-group-2', name: 'Aventura en París', description: 'Explorando París juntos' }
    ]
    showGroupSelection.value = true
  } finally {
    isLoading.value = false
  }
}

const selectGroup = async (group) => {
  selectedGroup.value = group
  showGroupSelection.value = false
  await initializeChat()
}

const createNewGroup = () => {
  // Redirect to group creation page or show modal
  router.push('/travel-planner')
}

const goBack = () => {
  router.push('/')
}

// Chat initialization
const initializeChat = async () => {
  if (!selectedGroup.value || !currentUser.value) return

  try {
    // Load group members
    const members = await chatService.getGroupMembers(selectedGroup.value.id)
    console.log("los intocables", members)
    groupMembers.value = members


    // Get active connections count
    try {
      const connections = await chatService.getActiveConnections(selectedGroup.value.id)
      onlineMembers.value = connections.active_connections || 0
    } catch (error) {
      console.log('Could not get active connections, using group members count')
      onlineMembers.value = members.length
    }

    // Load AI messages
    const aiMsgs = await chatService.getAIMessagesByGroup(selectedGroup.value.id)
    if (aiMsgs.length > 0) {
      aiMessages.value = aiMsgs
    } else {
      aiMessages.value = [{
      id: 1,
      message: "Hello! I'm your AI travel assistant. I'm here to help you plan the perfect trip based on your group's preferences. What destination are you considering?",
      created_at: new Date().toISOString()
    }]
    }

    // Load group messages
    const groupMsgs = await chatService.getMessagesByGroup(selectedGroup.value.id)
    groupMessages.value = groupMsgs

    // Connect to WebSocket
    connectWebSocket()

    // Scroll to bottom after loading
    nextTick(() => {
      scrollAiToBottom()
      scrollGroupToBottom()
    })
    
    setTimeout(() => {
      scrollAiToBottom()
      scrollGroupToBottom()
    }, 500)
  } catch (error) {
    console.error('Error initializing chat:', error)
    // Add demo data if API fails
    groupMembers.value = [
      { user_id: 'user-1', name: 'Alice Johnson', avatar: '👩‍💼' },
      { user_id: 'user-2', name: 'Bob Smith', avatar: '👨‍💻' },
      { user_id: 'user-3', name: 'Carol Davis', avatar: '👩‍🎨' }
    ]
    onlineMembers.value = 3
    aiMessages.value = [{
      id: 1,
      message: "Hello! I'm your AI travel assistant. I'm here to help you plan the perfect trip based on your group's preferences. What destination are you considering?",
      created_at: new Date().toISOString()
    }]
    groupMessages.value = [{
      id: 1,
      message: "Hey everyone! Let's start planning our summer trip. Any ideas for destinations?",
      user_id: 'user-1',
      created_at: new Date().toISOString()
    }]
    
    // Connect to WebSocket even with demo data
    connectWebSocket()
  }
}

// WebSocket functions
const connectWebSocket = () => {
  if (!selectedGroup.value || !currentUser.value) return

  websocketService.connect(selectedGroup.value.id)
  
  websocketService.on('connected', () => {
    websocketStatus.value = 'connected'
    console.log('WebSocket connected')
  })

  websocketService.on('disconnected', () => {
    websocketStatus.value = 'disconnected'
    console.log('WebSocket disconnected')
  })

  websocketService.on('message', handleWebSocketMessage)
}

const handleWebSocketMessage = (data) => {
  console.log('WebSocket message received:', data)


  if (data.type === 'new_message' && data.data.group_id === selectedGroup.value?.id) {
    groupMessages.value.push({
      id: Date.now(),
      message: data.data.message,
      user_id: data.data.user_id,
      created_at: new Date().toISOString()
    })
    scrollGroupToBottom()
  } else if (data.type === 'user_typing') {
    // Handle typing indicator
    isGroupTyping.value = true
    setTimeout(() => {
      isGroupTyping.value = false
    }, 3000)
  } else if (data.type === 'user_stop_typing') {
    isGroupTyping.value = false
  }
}

const handleGroupTyping = () => {
  if (websocketStatus.value === 'connected') {
    websocketService.sendTyping(currentUser.value.id)
  }
}

    // Message sending functions
    const sendAiMessage = async () => {
        if (!aiMessage.value.trim() || isAiTyping.value || !currentUser.value || !selectedGroup.value) return

      const userMessage = aiMessage.value
      aiMessage.value = ''

      // Add user message to UI immediately
      const userMsg = {
        id: Date.now(),
        message: userMessage,
        user_id: currentUser.value.id,
        created_at: new Date().toISOString()
      }
      aiMessages.value.push(userMsg)
      scrollAiToBottom()

      // Send to API
      try {
        isAiTyping.value = true
        
        const messageData = {
          user_id: currentUser.value.id,
          group_id: selectedGroup.value.id,
          message: userMessage
        }

        const response = await chatService.sendAIMessage(messageData)
        
        // Simulate AI response (in real app, this would come from AI service)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const aiResponses = [
          "Based on your group's preferences, I'd recommend Barcelona for a perfect mix of culture, food, and adventure.",
          "For your budget range, I suggest looking at flights 3-4 months in advance and considering shared accommodation.",
          "Given your interest in culture and adventure, you could combine museum days with mountain excursions.",
          "For transportation, Barcelona has excellent metro and you can also use shared bicycles.",
          "I recommend booking popular restaurants in advance, especially for large groups."
        ]
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        const aiMsg = {
          id: Date.now() + 1,
          message: randomResponse,
          created_at: new Date().toISOString()
        }
        aiMessages.value.push(aiMsg)
        scrollAiToBottom()
      } catch (error) {
        console.error('Error sending AI message:', error)
        aiMessages.value.push({
          id: Date.now() + 1,
          message: "Sorry, I'm having trouble processing your request. Please try again.",
          created_at: new Date().toISOString()
        })
        scrollAiToBottom()
      } finally {
        isAiTyping.value = false
      }
    }

    const sendGroupMessage = async () => {
      if (!groupMessage.value.trim() || isGroupTyping.value || !currentUser.value || !selectedGroup.value || websocketStatus.value !== 'connected') return
      const userMessage = groupMessage.value
      groupMessage.value = ''

      // Send via WebSocket for real-time
      websocketService.sendMessage(currentUser.value.id, userMessage)
    }

    const sendQuickMessage = (text) => {
      groupMessage.value = text
      sendGroupMessage()
    }

    const generateAiInsight = async () => {
      if (!currentUser.value) return
      
      isAiTyping.value = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const insights = [
        "Based on your group's conversation, I detect a preference for European destinations with rich cultural heritage. Consider Barcelona, Rome, or Amsterdam.",
        "Your group seems to value both adventure and comfort. I recommend a mix of guided tours and free exploration time.",
        "From the budget discussion, I suggest looking at shoulder season travel (May-June or September-October) for better prices.",
        "The group shows interest in local cuisine. I can suggest authentic restaurants and food tours in your chosen destination."
      ]
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)]
      aiMessages.value.push({
        id: Date.now(),
        message: randomInsight,
        created_at: new Date().toISOString()
      })
      scrollAiToBottom()
      isAiTyping.value = false
    }

    const generateGroupSuggestion = async () => {
      isGroupTyping.value = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const suggestions = [
        "How about we create a shared Google Doc to track our ideas?",
        "Should we set up a voting system for the final destination?",
        "What if we each research one aspect (flights, hotels, activities) and share our findings?",
        "Let's set a deadline for making the final decision."
      ]
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      groupMessages.value.push({
        id: Date.now(),
        message: randomSuggestion,
        user_id: 'system',
        created_at: new Date().toISOString()
      })
      scrollGroupToBottom()
      isGroupTyping.value = false
    }

// Enhanced watchers for messages and scroll
watch(aiMessages, (newMessages, oldMessages) => {
  if (newMessages.length > (oldMessages?.length || 0)) {
    scrollAiToBottom()
  }
}, { deep: true })

watch(groupMessages, (newMessages, oldMessages) => {
  if (newMessages.length > (oldMessages?.length || 0)) {
    scrollGroupToBottom()
  }
}, { deep: true })

watch(isAiTyping, (isTyping) => {
  if (isTyping) {
    scrollAiToBottom()
  }
})

watch(isGroupTyping, (isTyping) => {
  if (isTyping) {
    scrollGroupToBottom()
  }
})

// Lifecycle
onMounted(async () => {
  await loadUserGroups()
})

// Cleanup
onUnmounted(() => {
  websocketService.disconnect()
})
</script>

<style scoped>
.chat-main-container {
  height: 100vh;
  overflow: hidden;
}

.glass-effect {
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.chat-content {
  height: calc(100vh - 80px);
  overflow: hidden;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages-area {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.chat-messages-area::-webkit-scrollbar {
  width: 6px;
}

.chat-messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-area::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.chat-input-area {
  flex-shrink: 0;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #3b82f6;
}

.input-field::placeholder {
  color: rgba(156, 163, 175, 0.7);
}

.card {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.chat-bubble {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  max-width: 100%;
  word-wrap: break-word;
  backdrop-filter: blur(10px);
}

.chat-bubble-ai {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.chat-bubble-user {
  background: rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
}

.chat-bubble-group {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.3);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: #6b7280;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: rgba(75, 85, 99, 0.8);
  color: white;
  border: 1px solid rgba(75, 85, 99, 0.5);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: rgba(75, 85, 99, 1);
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-content {
    flex-direction: column;
  }
  
  .chat-panel {
    width: 100% !important;
  }
  

}
</style>