class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = import.meta.env.VITE_WS_RECONNECT_ATTEMPTS || 5
    this.reconnectDelay = import.meta.env.VITE_WS_RECONNECT_DELAY || 3000
    this.listeners = new Map()
    this.isConnecting = false
    this.connectionTimeout = null
    this.heartbeatInterval = null
    this.heartbeatTimeout = 30000 // 30 segundos
    this.currentGroupId = null
  }

  // Connect to WebSocket
  connect(groupId) {
    if (this.isConnecting) {
      console.log('WebSocket connection already in progress')
      return
    }

    // Limpiar conexión anterior si existe
    this.disconnect()

    this.isConnecting = true
    this.currentGroupId = groupId
    
    // Construir URL del WebSocket con manejo de barras
    const baseUrl = import.meta.env.VITE_WS_BASE_URL || 'wss://hstp4bpv-8000.usw3.devtunnels.ms'
    const wsUrl = `${baseUrl.replace(/\/$/, '')}/ws/chat/${groupId}`
    
    console.log('Attempting to connect to WebSocket:', wsUrl)
    console.log('Group ID:', groupId)
    console.log('Base WS URL:', baseUrl)
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      // Configurar timeout de conexión
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket connection timeout')
          this.ws.close()
        }
      }, 10000) // 10 segundos timeout
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully')
        this.isConnecting = false
        this.reconnectAttempts = 0
        clearTimeout(this.connectionTimeout)
        
        // Iniciar heartbeat
        this.startHeartbeat()
        
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('WebSocket message received:', data)
          this.emit('message', data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          groupId: this.currentGroupId
        })
        this.isConnecting = false
        clearTimeout(this.connectionTimeout)
        this.stopHeartbeat()
        this.emit('disconnected', event)
        
        // Attempt to reconnect if not a normal closure and we haven't exceeded max attempts
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting reconnection ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`)
          this.reconnect(groupId)
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('Max reconnection attempts reached')
          this.emit('max_reconnect_attempts_reached')
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', {
          error,
          readyState: this.ws?.readyState,
          url: wsUrl,
          groupId: this.currentGroupId
        })
        this.isConnecting = false
        clearTimeout(this.connectionTimeout)
        this.emit('error', error)
      }

    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      this.isConnecting = false
      clearTimeout(this.connectionTimeout)
      this.emit('error', error)
    }
  }

  // Reconnect to WebSocket
  reconnect(groupId) {
    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
    
    // Usar delay exponencial para evitar spam de reconexiones
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      if (this.currentGroupId === groupId) {
        this.connect(groupId)
      }
    }, delay)
  }

  // Heartbeat para mantener la conexión activa
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping' }))
        } catch (error) {
          console.error('Error sending heartbeat:', error)
        }
      }
    }, this.heartbeatTimeout)
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Send message
  sendMessage(userId, message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const data = {
          type: 'send_message',
          data: {
            user_id: userId,
            message: message
          }
        }
        this.ws.send(JSON.stringify(data))
        console.log('Message sent via WebSocket:', data)
      } catch (error) {
        console.error('Error sending message via WebSocket:', error)
        this.emit('send_error', error)
      }
    } else {
      console.error('WebSocket is not connected')
      this.emit('send_error', new Error('WebSocket not connected'))
    }
  }

  // Send typing indicator
  sendTyping(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const data = {
          type: 'typing',
          data: {
            user_id: userId
          }
        }
        this.ws.send(JSON.stringify(data))
      } catch (error) {
        console.error('Error sending typing indicator:', error)
      }
    }
  }

  // Send stop typing indicator
  sendStopTyping(userId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const data = {
          type: 'stop_typing',
          data: {
            user_id: userId
          }
        }
        this.ws.send(JSON.stringify(data))
      } catch (error) {
        console.error('Error sending stop typing indicator:', error)
      }
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
    clearTimeout(this.connectionTimeout)
    this.stopHeartbeat()
    this.listeners.clear()
    this.reconnectAttempts = 0
    this.isConnecting = false
    this.currentGroupId = null
  }

  // Check if connected
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }

  // Get connection status
  getConnectionStatus() {
    if (!this.ws) return 'disconnected'
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'disconnected'
      default:
        return 'unknown'
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService()
export default websocketService 