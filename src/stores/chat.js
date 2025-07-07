import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref([])
  const isTyping = ref(false)
  const groupMembers = ref([
    { id: 1, name: 'Ana', avatar: '👩‍💼', color: 'bg-pink-500' },
    { id: 2, name: 'Carlos', avatar: '👨‍💻', color: 'bg-blue-500' },
    { id: 3, name: 'María', avatar: '👩‍🎨', color: 'bg-purple-500' },
    { id: 4, name: 'Luis', avatar: '👨‍🏫', color: 'bg-green-500' }
  ])
  const currentUser = ref({ id: 1, name: 'Ana', avatar: '👩‍💼', color: 'bg-pink-500' })
  const travelPreferences = ref({
    destination: '',
    budget: '',
    dates: '',
    activities: [],
    accommodation: '',
    transport: ''
  })

  // Getters
  const getMessages = computed(() => messages.value)
  const getIsTyping = computed(() => isTyping.value)
  const getGroupMembers = computed(() => groupMembers.value)
  const getCurrentUser = computed(() => currentUser.value)
  const getTravelPreferences = computed(() => travelPreferences.value)

  // Actions
  const addMessage = (message) => {
    messages.value.push({
      id: Date.now(),
      ...message,
      timestamp: new Date().toISOString()
    })
  }

  const addAIMessage = async (content) => {
    isTyping.value = true
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiMessage = {
      id: Date.now(),
      type: 'ai',
      content,
      sender: 'AI Assistant',
      avatar: '🤖',
      color: 'bg-gray-500'
    }
    
    messages.value.push(aiMessage)
    isTyping.value = false
  }

  const updateTravelPreferences = (preferences) => {
    travelPreferences.value = { ...travelPreferences.value, ...preferences }
  }

  const generateAISuggestion = async (context) => {
    const suggestions = [
      "Basándome en sus preferencias, sugiero considerar Barcelona para su viaje. Es perfecta para grupos con intereses diversos.",
      "Para su presupuesto, recomiendo buscar vuelos con 3-4 meses de anticipación y considerar alojamiento compartido.",
      "Dado que les gusta la cultura y la aventura, podrían combinar días de museos con excursiones a la montaña.",
      "Para el transporte, Barcelona tiene excelente metro y también pueden usar bicicletas compartidas.",
      "Sugiero reservar restaurantes populares con anticipación, especialmente para grupos grandes."
    ]
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    await addAIMessage(randomSuggestion)
  }

  const clearChat = () => {
    messages.value = []
  }

  return {
    // State
    messages,
    isTyping,
    groupMembers,
    currentUser,
    travelPreferences,
    
    // Getters
    getMessages,
    getIsTyping,
    getGroupMembers,
    getCurrentUser,
    getTravelPreferences,
    
    // Actions
    addMessage,
    addAIMessage,
    updateTravelPreferences,
    generateAISuggestion,
    clearChat
  }
}) 