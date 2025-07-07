<template>
  <div class="chat-main-container bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="glass-effect p-4 border-b border-gray-700 flex-shrink-0">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-2xl">🏠</router-link>
          <div>
            <h1 class="text-xl font-bold text-white">Travel ProSus - Group Planning</h1>
            <p class="text-gray-400 text-sm">AI Assistant + Group Collaboration</p>
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
    <main class="chat-content flex">
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
              <h2 class="font-semibold text-white">Group Discussion</h2>
              <p class="text-gray-400 text-sm">
                {{ onlineMembers }} {{ onlineMembers === 1 ? 'member' : 'members' }} online • {{ groupMembers.length }} total
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
                @input="scrollGroupToBottom"
                @focus="scrollGroupToBottom"
                type="text"
                placeholder="Discuss with your group about the trip..."
                class="input-field pr-12"
                :disabled="isGroupTyping"
              />
              <button
                @click="sendGroupMessage"
                :disabled="!groupMessage.trim() || isGroupTyping"
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { chatService } from '@/services/chatService'
import { groupService } from '@/services/groupService'
import websocketService from '@/services/websocketService'

// Store
const authStore = useAuthStore()

// Refs
const aiMessage = ref('')
const groupMessage = ref('')
const isAiTyping = ref(false)
const isGroupTyping = ref(false)
const aiChatContainer = ref(null)
const groupChatContainer = ref(null)

// Current user and group data
const currentUser = computed(() => authStore.currentUser)
const currentGroupId = ref('demo-group-123') // This should come from route params or store

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
      const member = groupMembers.value.find(m => m.user_id === userId)
      return member?.name || 'Unknown User'
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // Enhanced scroll to bottom functions
    const scrollToBottom = (container) => {
      if (container) {
        // Use multiple approaches to ensure scroll works
        nextTick(() => {
          // Method 1: Direct scroll
          container.scrollTop = container.scrollHeight
          
          // Method 2: Smooth scroll with timeout
          setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            })
          }, 100)
          
          // Method 3: Force scroll after DOM update
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

    const sendAiMessage = async () => {
      if (!aiMessage.value.trim() || isAiTyping.value || !currentUser.value) return

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
          group_id: currentGroupId.value,
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
        // Add error message to chat
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
      if (!groupMessage.value.trim() || isGroupTyping.value || !currentUser.value) return

      const userMessage = groupMessage.value
      groupMessage.value = ''

      // Add user message to UI immediately
      const userMsg = {
        id: Date.now(),
        message: userMessage,
        user_id: currentUser.value.id,
        created_at: new Date().toISOString()
      }
      groupMessages.value.push(userMsg)
      scrollGroupToBottom()

      // Send to API and WebSocket
      try {
        const messageData = {
          user_id: currentUser.value.id,
          group_id: currentGroupId.value,
          message: userMessage
        }

        // Send to API
        await chatService.sendGroupMessage(messageData)
        
        // Send via WebSocket for real-time
        websocketService.sendMessage(currentUser.value.id, userMessage)
        
      } catch (error) {
        console.error('Error sending group message:', error)
        // Add error message to chat
        groupMessages.value.push({
          id: Date.now() + 1,
          message: "Error sending message. Please try again.",
          user_id: 'system',
          created_at: new Date().toISOString()
        })
        scrollGroupToBottom()
      }
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

    // Load initial data
    const loadInitialData = async () => {
      try {
        // Load group members for the current group
        const members = await chatService.getGroupMembers(currentGroupId.value)
        groupMembers.value = members

        // Get active connections count
        try {
          const connections = await chatService.getActiveConnections(currentGroupId.value)
          onlineMembers.value = connections.active_connections || 0
        } catch (error) {
          console.log('Could not get active connections, using group members count')
          onlineMembers.value = members.length
        }

        // Load AI messages
        const aiMsgs = await chatService.getAIMessagesByGroup(currentGroupId.value)
        aiMessages.value = aiMsgs

        // Load group messages
        const groupMsgs = await chatService.getMessagesByGroup(currentGroupId.value)
        groupMessages.value = groupMsgs

        // Scroll to bottom after loading
        nextTick(() => {
          scrollAiToBottom()
          scrollGroupToBottom()
        })
        
        // Additional scroll after a delay to ensure everything is rendered
        setTimeout(() => {
          scrollAiToBottom()
          scrollGroupToBottom()
        }, 500)
      } catch (error) {
        console.error('Error loading initial data:', error)
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
      }
    }

    // WebSocket event handlers
    const handleWebSocketMessage = (data) => {
      if (data.type === 'message' && data.data.group_id === currentGroupId.value) {
        groupMessages.value.push({
          id: Date.now(),
          message: data.data.message,
          user_id: data.data.user_id,
          created_at: new Date().toISOString()
        })
        scrollGroupToBottom()
      }
    }

    // Enhanced watchers for messages and scroll
    watch(aiMessages, (newMessages, oldMessages) => {
      // Only scroll if new messages were added
      if (newMessages.length > (oldMessages?.length || 0)) {
        scrollAiToBottom()
      }
    }, { deep: true })

    watch(groupMessages, (newMessages, oldMessages) => {
      // Only scroll if new messages were added
      if (newMessages.length > (oldMessages?.length || 0)) {
        scrollGroupToBottom()
      }
    }, { deep: true })

    // Watch for typing indicators
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
      await loadInitialData()
      
      // Connect to WebSocket
      websocketService.connect(currentGroupId.value)
      websocketService.on('message', handleWebSocketMessage)
    })

    // Cleanup
    onUnmounted(() => {
      websocketService.disconnect()
    })
</script>