<template>
  <div class="min-h-screen bg-black relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div class="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
      
      <!-- Floating elements -->
      <div class="absolute top-32 right-32 text-4xl animate-bounce" style="animation-delay: 1s;">✈️</div>
      <div class="absolute bottom-32 left-32 text-4xl animate-bounce" style="animation-delay: 3s;">🌍</div>
      <div class="absolute top-1/3 left-1/4 text-3xl animate-spin" style="animation-duration: 20s;">🤖</div>
      <div class="absolute bottom-1/3 right-1/4 text-3xl animate-pulse">💬</div>
    </div>

    <!-- Navigation -->
    <Navigation />

    <!-- Hero Section -->
    <main class="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <!-- Main heading with gradient text -->
      <h1 class="text-6xl md:text-8xl font-bold mb-8 leading-tight">
        <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI-Powered
        </span>
        <br>
        <span class="text-white">Group Travel</span>
        <br>
        <span class="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Planning
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-xl md:text-2xl text-gray-300 max-w-4xl mb-12 leading-relaxed">
        Revolutionize how groups plan trips together. Our AI assistant learns from your conversations 
        and helps you make perfect travel decisions as a team.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-6 mb-16">
        <router-link 
          to="/register" 
          class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <span class="relative z-10 flex items-center gap-2">
            <span>🚀</span>
            Create Free Account
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </router-link>
        
        <router-link 
          to="/login" 
          class="px-8 py-4 border-2 border-gray-600 rounded-2xl text-white font-semibold text-lg hover:border-gray-400 transition-colors duration-300 flex items-center gap-2"
        >
          <span>🔐</span>
                      Sign In
        </router-link>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        <div class="text-center">
          <div class="text-4xl font-bold text-blue-400 mb-2">500+</div>
          <div class="text-gray-400">Trips Planned</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-400 mb-2">98%</div>
          <div class="text-gray-400">Satisfaction Rate</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">24/7</div>
          <div class="text-gray-400">AI Support</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-pink-400 mb-2">50+</div>
          <div class="text-gray-400">Countries</div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section id="features" class="relative z-10 py-20 px-6">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16">
          <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Revolutionary Features
          </span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group card-hover text-center p-8 transform transition-all duration-300 hover:scale-105">
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 class="text-2xl font-bold text-white mb-4">AI Travel Assistant</h3>
            <p class="text-gray-400 leading-relaxed">
              Our AI learns from your group conversations and provides intelligent suggestions for destinations, 
              budgets, and activities that match everyone's preferences.
            </p>
          </div>
          
          <div class="group card-hover text-center p-8 transform transition-all duration-300 hover:scale-105">
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💬</div>
            <h3 class="text-2xl font-bold text-white mb-4">Group Collaboration</h3>
            <p class="text-gray-400 leading-relaxed">
              Real-time chat where your entire group can discuss, vote, and make decisions together. 
              No more endless group chats and missed messages.
            </p>
          </div>
          
          <div class="group card-hover text-center p-8 transform transition-all duration-300 hover:scale-105">
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 class="text-2xl font-bold text-white mb-4">Smart Booking</h3>
            <p class="text-gray-400 leading-relaxed">
              Once your group reaches consensus, book everything in one place - flights, hotels, 
              and activities with AI-optimized recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="relative z-10 py-20 px-6 bg-gray-900/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16">
          <span class="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 class="text-xl font-bold text-white mb-2">Start Chat</h3>
            <p class="text-gray-400">Create a group chat and invite your travel companions</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 class="text-xl font-bold text-white mb-2">AI Learns</h3>
            <p class="text-gray-400">Our AI analyzes your conversations and preferences</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 class="text-xl font-bold text-white mb-2">Get Suggestions</h3>
            <p class="text-gray-400">Receive personalized recommendations and options</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 class="text-xl font-bold text-white mb-2">Book & Go</h3>
            <p class="text-gray-400">Book everything and enjoy your perfect trip</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" class="relative z-10 py-20 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-8">
          <span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            See It In Action
          </span>
        </h2>
        <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Experience the future of group travel planning. Our AI assistant makes planning fun, 
          efficient, and personalized for everyone in your group.
        </p>
        <router-link 
          to="/register" 
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold text-lg hover:scale-105 transition-transform duration-300"
        >
          <span>🎮</span>
          Try Free Demo
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 py-12 px-6 border-t border-gray-800">
      <div class="max-w-7xl mx-auto text-center">
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="text-2xl">🚀</div>
          <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Travel Buddies
          </span>
        </div>
        <p class="text-gray-400 mb-6">
          Revolutionizing group travel planning with AI-powered collaboration
        </p>
        <div class="flex justify-center gap-6 text-gray-400">
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
          <a href="#" class="hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue'
</script> 