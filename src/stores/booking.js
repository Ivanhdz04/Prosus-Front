import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  // State
  const flights = ref([])
  const hotels = ref([])
  const activities = ref([])
  const selectedFlight = ref(null)
  const selectedHotel = ref(null)
  const selectedActivities = ref([])
  const bookingSummary = ref(null)
  const isLoading = ref(false)

  // Mock data for demo
  const mockFlights = [
    {
      id: 1,
      airline: 'Iberia',
      flightNumber: 'IB1234',
      departure: 'MAD',
      arrival: 'BCN',
      departureTime: '08:30',
      arrivalTime: '09:45',
      price: 120,
      duration: '1h 15m',
      stops: 0
    },
    {
      id: 2,
      airline: 'Vueling',
      flightNumber: 'VY1234',
      departure: 'MAD',
      arrival: 'BCN',
      departureTime: '14:15',
      arrivalTime: '15:30',
      price: 95,
      duration: '1h 15m',
      stops: 0
    },
    {
      id: 3,
      airline: 'Air Europa',
      flightNumber: 'UX1234',
      departure: 'MAD',
      arrival: 'BCN',
      departureTime: '19:45',
      arrivalTime: '21:00',
      price: 110,
      duration: '1h 15m',
      stops: 0
    }
  ]

  const mockHotels = [
    {
      id: 1,
      name: 'Hotel Arts Barcelona',
      location: 'Barcelona, España',
      rating: 4.8,
      price: 250,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
      id: 2,
      name: 'W Barcelona',
      location: 'Barcelona, España',
      rating: 4.6,
      price: 320,
      amenities: ['WiFi', 'Beach', 'Bar', 'Gym'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'
    },
    {
      id: 3,
      name: 'Hotel 1898',
      location: 'Barcelona, España',
      rating: 4.4,
      price: 180,
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Terrace'],
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
    }
  ]

  const mockActivities = [
    {
      id: 1,
      name: 'Visita a la Sagrada Familia',
      location: 'Barcelona',
      price: 25,
      duration: '2h',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400'
    },
    {
      id: 2,
      name: 'Tour por el Barrio Gótico',
      location: 'Barcelona',
      price: 35,
      duration: '3h',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400'
    },
    {
      id: 3,
      name: 'Paseo en Barco por el Puerto',
      location: 'Barcelona',
      price: 45,
      duration: '1.5h',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
    }
  ]

  // Getters
  const getFlights = computed(() => flights.value)
  const getHotels = computed(() => hotels.value)
  const getActivities = computed(() => activities.value)
  const getSelectedFlight = computed(() => selectedFlight.value)
  const getSelectedHotel = computed(() => selectedHotel.value)
  const getSelectedActivities = computed(() => selectedActivities.value)
  const getBookingSummary = computed(() => bookingSummary.value)
  const getIsLoading = computed(() => isLoading.value)

  const getTotalPrice = computed(() => {
    let total = 0
    if (selectedFlight.value) total += selectedFlight.value.price
    if (selectedHotel.value) total += selectedHotel.value.price * 3 // 3 nights
    selectedActivities.value.forEach(activity => {
      total += activity.price
    })
    return total
  })

  // Actions
  const searchFlights = async (from, to, date) => {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    flights.value = mockFlights
    isLoading.value = false
  }

  const searchHotels = async (location, checkIn, checkOut) => {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    hotels.value = mockHotels
    isLoading.value = false
  }

  const searchActivities = async (location) => {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    activities.value = mockActivities
    isLoading.value = false
  }

  const selectFlight = (flight) => {
    selectedFlight.value = flight
  }

  const selectHotel = (hotel) => {
    selectedHotel.value = hotel
  }

  const toggleActivity = (activity) => {
    const index = selectedActivities.value.findIndex(a => a.id === activity.id)
    if (index > -1) {
      selectedActivities.value.splice(index, 1)
    } else {
      selectedActivities.value.push(activity)
    }
  }

  const createBooking = async () => {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    bookingSummary.value = {
      id: `BK${Date.now()}`,
      flight: selectedFlight.value,
      hotel: selectedHotel.value,
      activities: selectedActivities.value,
      totalPrice: getTotalPrice.value,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    isLoading.value = false
    return bookingSummary.value
  }

  const clearBooking = () => {
    selectedFlight.value = null
    selectedHotel.value = null
    selectedActivities.value = []
    bookingSummary.value = null
  }

  return {
    // State
    flights,
    hotels,
    activities,
    selectedFlight,
    selectedHotel,
    selectedActivities,
    bookingSummary,
    isLoading,
    
    // Getters
    getFlights,
    getHotels,
    getActivities,
    getSelectedFlight,
    getSelectedHotel,
    getSelectedActivities,
    getBookingSummary,
    getIsLoading,
    getTotalPrice,
    
    // Actions
    searchFlights,
    searchHotels,
    searchActivities,
    selectFlight,
    selectHotel,
    toggleActivity,
    createBooking,
    clearBooking
  }
}) 