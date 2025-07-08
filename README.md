# 🚀 Travel Buddies - AI-Powered Group Travel Planning Platform

A modern, full-stack web application for collaborative group travel planning with AI assistance. Built with Vue.js 3, featuring real-time chat, intelligent recommendations, and comprehensive booking management.

## ✨ Features

### 🤖 AI-Powered Travel Assistant
- Intelligent destination recommendations based on group preferences
- Budget analysis and optimization suggestions
- Personalized activity recommendations
- Real-time conversation analysis for better suggestions

### 💬 Real-Time Group Collaboration
- Live group chat with WebSocket integration
- AI chat assistant with intelligent responses
- Quick action buttons for common travel questions
- Typing indicators and message timestamps
- User avatars and color-coded messages

### 📋 Comprehensive Travel Planning
- Group preference consensus tracking
- Destination voting and decision making
- Budget planning and cost sharing
- Date coordination and availability checking
- Activity planning and itinerary management

### 🏨 Complete Booking System
- Flight search and booking integration
- Hotel recommendations and reservations
- Activity booking and tour management
- Cost tracking and budget management
- Booking confirmation and itinerary generation

### 🔐 Secure Authentication
- JWT-based authentication system
- User registration and profile management
- Protected routes and session management
- Password security and account recovery

### 🎨 Modern UI/UX
- Dark mode interface with glassmorphism effects
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation and user experience

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **HTTP Client**: Axios with interceptors
- **Real-time**: WebSocket API

### Backend Integration
- **API**: RESTful API with comprehensive endpoints
- **Authentication**: JWT tokens with refresh mechanism
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket server for live chat
- **AI Integration**: OpenAI API for intelligent responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation


1. **Install dependencies**
```bash
npm install
```

2. **Environment setup**
```bash
# Copy environment file
cp env.example .env.local

# Configure your environment variables
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📱 Application Flow

### 1. Landing Page
- Professional landing page with feature highlights
- Call-to-action buttons for registration and login
- Demo credentials for quick testing

### 2. Authentication
- User registration with email verification
- Secure login with JWT tokens
- Password recovery and account management

### 3. Group Chat Interface
- Split-screen layout: AI Assistant (75%) + Group Chat (25%)
- Real-time messaging with WebSocket
- AI-powered travel recommendations
- Quick action buttons for common queries

### 4. Travel Planning
- Collaborative destination selection
- Budget planning and cost sharing
- Date coordination and availability
- Activity planning and preferences

### 5. Booking Management
- Flight search and booking
- Hotel recommendations and reservations
- Activity booking and tour management
- Cost tracking and confirmation

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   └── Navigation.vue  # Main navigation component
├── views/              # Page components
│   ├── Home.vue        # Landing page
│   ├── Login.vue       # Authentication
│   ├── Register.vue    # User registration
│   ├── GroupChat.vue   # Main chat interface
│   ├── TravelPlanner.vue # Planning dashboard
│   ├── Booking.vue     # Booking management
│   └── Profile.vue     # User profile
├── stores/             # Pinia state management
│   ├── auth.js         # Authentication state
│   ├── chat.js         # Chat state
│   └── booking.js      # Booking state
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API
│   ├── chatService.js  # Chat and AI API
│   ├── groupService.js # Group management
│   ├── tripService.js  # Trip planning
│   ├── hotelService.js # Hotel booking
│   ├── flightService.js # Flight booking
│   ├── itineraryService.js # Itinerary management
│   ├── voteService.js  # Voting system
│   ├── preferencesService.js # User preferences
│   ├── bookingService.js # Booking management
│   └── websocketService.js # Real-time communication
├── router/             # Vue Router configuration
├── style.css           # Global styles
└── main.js             # Application entry point
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh JWT token

### Users
- `POST /users/` - Create user
- `GET /users/` - Get all users
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Groups
- `POST /groups/` - Create group
- `GET /groups/` - Get all groups
- `GET /groups/{id}` - Get group by ID
- `PUT /groups/{id}` - Update group
- `DELETE /groups/{id}` - Delete group

### Chat
- `POST /group-chat/` - Send group message
- `GET /group-chat/group/{id}` - Get group messages
- `POST /ia_chat/` - Send AI message
- `GET /ia_chat/group/{id}` - Get AI messages

### Travel Planning
- `POST /trips/` - Create trip
- `GET /trips/` - Get all trips
- `POST /hotels/` - Add hotel
- `POST /flights/` - Add flight
- `POST /itineraries/` - Create itinerary

### WebSocket
- `WebSocket /ws/chat/{group_id}` - Real-time chat
- Message types: `send_message`, `typing`, `stop_typing`

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) and Purple (#8B5CF6)
- **Background**: Dark grays (#111827, #1F2937)
- **Text**: Light grays (#F9FAFB, #D1D5DB)
- **Accents**: Green (#10B981), Red (#EF4444)

### Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with hover effects
- Smooth transitions and animations
- Responsive grid layouts
- Custom scrollbars

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_BASE_URL=wss://your-api-domain.com
VITE_APP_NAME=Travel Buddies
VITE_APP_VERSION=1.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- OpenAI for AI integration capabilities
- The open-source community for inspiration

---

**Travel Buddies** - Making group travel planning effortless with AI assistance 🚀✈️ 