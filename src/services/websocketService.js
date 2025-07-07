class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = import.meta.env.VITE_WS_RECONNECT_ATTEMPTS || 5
    this.reconnectDelay = import.meta.env.VITE_WS_RECONNECT_DELAY || 3000
    this.listeners = new Map()
    this.isConnecting = false
  }

  // Connect to WebSocket
  connect(groupId) {
    if (this.isConnecting) return

    this.isConnecting = true
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/ws/chat/${groupId}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit('message', data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.isConnecting = false
        this.emit('disconnected', event)
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect(groupId)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        this.emit('error', error)
      }

    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      this.isConnecting = false
      this.emit('error', error)
    }
  }

  // Reconnect to WebSocket
  reconnect(groupId) {
    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
    
    setTimeout(() => {
      this.connect(groupId)
    }, this.reconnectDelay)
  }

  // Send message
  sendMessage(userId, message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        type: 'send_message',
        data: {
          user_id: userId,
          message: message
        }
      }
      this.ws.send(JSON.stringify(data))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  // Send typing indicator
  sendTyping(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        type: 'typing',
        data: {
          user_id: userId
        }
      }
      this.ws.send(JSON.stringify(data))
    }
  }

  // Send stop typing indicator
  sendStopTyping(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        type: 'stop_typing',
        data: {
          user_id: userId
        }
      }
      this.ws.send(JSON.stringify(data))
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected')
      this.ws = null
    }
    this.listeners.clear()
    this.reconnectAttempts = 0
    this.isConnecting = false
  }

  // Check if connected
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// Create singleton instance
const websocketService = new WebSocketService()
export default websocketService 