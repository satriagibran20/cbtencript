// Import SweetAlert2
import Swal from "sweetalert2"

class ChatClient {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000

    this.initializeChat()
  }

  initializeChat() {
    this.connect()
    this.setupEventListeners()
  }

  connect() {
    try {
      this.socket = new WebSocket("ws://localhost:8080")

      this.socket.onopen = (event) => {
        console.log("Connected to chat server")
        this.isConnected = true
        this.reconnectAttempts = 0
        this.authenticate()
        this.updateConnectionStatus(true)
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      }

      this.socket.onclose = (event) => {
        console.log("Disconnected from chat server")
        this.isConnected = false
        this.updateConnectionStatus(false)
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.updateConnectionStatus(false)
      }
    } catch (error) {
      console.error("Failed to connect to chat server:", error)
      this.updateConnectionStatus(false)
      this.attemptReconnect()
    }
  }

  authenticate() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const authData = {
        type: "auth",
        user_id: window.currentUser.id,
        nama: window.currentUser.nama,
        role: window.currentUser.role,
      }

      this.socket.send(JSON.stringify(authData))
    }
  }

  sendMessage(message, toUserId = null) {
    if (!this.isConnected) {
      this.showNotification("Tidak terhubung ke server chat", "error")
      return false
    }

    const messageData = {
      type: toUserId ? "private_message" : "message",
      message: message,
      to_user_id: toUserId,
    }

    this.socket.send(JSON.stringify(messageData))
    return true
  }

  handleMessage(data) {
    switch (data.type) {
      case "auth_success":
        console.log("Authentication successful")
        this.loadChatHistory()
        break

      case "message":
        this.displayMessage(data)
        break

      case "private_message":
        this.displayPrivateMessage(data)
        break

      case "user_status":
        this.updateUserStatus(data.user_id, data.status)
        break

      case "message_sent":
        this.showNotification(data.message, "success")
        break
    }
  }

  displayMessage(data) {
    const chatMessages = document.getElementById("chatMessages")
    if (!chatMessages) return

    const messageDiv = document.createElement("div")
    messageDiv.className = `mb-3 ${data.from_user_id == window.currentUser.id ? "text-right" : "text-left"}`

    const roleColor = this.getRoleColor(data.from_role)

    messageDiv.innerHTML = `
            <div class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              data.from_user_id == window.currentUser.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
            }">
                <div class="text-xs opacity-75 mb-1">
                    <span class="${roleColor}">${data.from_name}</span>
                    <span class="ml-2">${this.formatTime(data.timestamp)}</span>
                </div>
                <div class="text-sm">${this.escapeHtml(data.message)}</div>
            </div>
        `

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Show notification if chat is closed
    if (document.getElementById("chatBox").classList.contains("hidden")) {
      this.showChatNotification()
    }
  }

  displayPrivateMessage(data) {
    // Similar to displayMessage but for private messages
    this.displayMessage(data)
  }

  loadChatHistory() {
    fetch("/api/get_chat_history.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const chatMessages = document.getElementById("chatMessages")
          chatMessages.innerHTML = ""

          data.messages.forEach((message) => {
            this.displayMessage({
              from_user_id: message.from_user,
              from_name: message.from_name,
              from_role: message.from_role,
              message: message.pesan,
              timestamp: message.waktu,
            })
          })
        }
      })
      .catch((error) => {
        console.error("Error loading chat history:", error)
      })
  }

  updateConnectionStatus(connected) {
    const statusIndicator = document.getElementById("chatStatus")
    if (statusIndicator) {
      statusIndicator.className = connected ? "w-2 h-2 bg-green-500 rounded-full" : "w-2 h-2 bg-red-500 rounded-full"
    }
  }

  updateUserStatus(userId, status) {
    // Update user status in UI
    const userElement = document.querySelector(`[data-user-id="${userId}"]`)
    if (userElement) {
      const statusDot = userElement.querySelector(".status-dot")
      if (statusDot) {
        statusDot.className =
          status === "online" ? "w-2 h-2 bg-green-500 rounded-full" : "w-2 h-2 bg-gray-400 rounded-full"
      }
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay)
    } else {
      console.log("Max reconnection attempts reached")
      this.showNotification("Gagal terhubung ke server chat", "error")
    }
  }

  setupEventListeners() {
    // Chat input enter key
    document.addEventListener("keypress", (e) => {
      if (e.target.id === "chatInput" && e.key === "Enter") {
        this.sendChatMessage()
      }
    })

    // Send button click
    document.addEventListener("click", (e) => {
      if (e.target.closest('[onclick="sendMessage()"]')) {
        e.preventDefault()
        this.sendChatMessage()
      }
    })
  }

  sendChatMessage() {
    const input = document.getElementById("chatInput")
    if (!input) return

    const message = input.value.trim()
    if (message && this.sendMessage(message)) {
      input.value = ""
    }
  }

  showChatNotification() {
    // Show notification badge on chat button
    const chatButton = document.querySelector("#chatWidget button")
    if (chatButton) {
      let badge = chatButton.querySelector(".notification-badge")
      if (!badge) {
        badge = document.createElement("span")
        badge.className =
          "notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        badge.textContent = "1"
        chatButton.appendChild(badge)
      } else {
        const count = Number.parseInt(badge.textContent) + 1
        badge.textContent = count.toString()
      }
    }
  }

  clearChatNotification() {
    const badge = document.querySelector(".notification-badge")
    if (badge) {
      badge.remove()
    }
  }

  getRoleColor(role) {
    switch (role) {
      case "admin":
        return "text-red-600"
      case "guru":
        return "text-blue-600"
      case "peserta":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  showNotification(message, type = "info") {
    // Use SweetAlert2 for notifications
    const icon = type === "error" ? "error" : type === "success" ? "success" : "info"

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}

// Initialize chat when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current user data for chat
  if (typeof window.currentUser === "undefined") {
    // Get user data from PHP session or API
    fetch("/api/get_current_user.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.currentUser = data.user
          window.chatClient = new ChatClient()
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error)
      })
  } else {
    window.chatClient = new ChatClient()
  }
})

// Global functions for backward compatibility
function toggleChat() {
  const chatBox = document.getElementById("chatBox")
  if (chatBox) {
    chatBox.classList.toggle("hidden")

    if (!chatBox.classList.contains("hidden")) {
      // Clear notification when chat is opened
      if (window.chatClient) {
        window.chatClient.clearChatNotification()
      }
    }
  }
}

function sendMessage() {
  if (window.chatClient) {
    window.chatClient.sendChatMessage()
  }
}
