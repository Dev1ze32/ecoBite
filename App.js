import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import DonationScreen from './screens/DonationScreen'
import InventoryScreen from './screens/InventoryScreen.js'
import ProfileScreen from './screens/ProfileScreen.js'
import CartScreen from './screens/CartScreen.js'
import LoginScreen from './screens/LoginScreen.js'
import SmartMealPlanScreen from './screens/SmartMealPlanScreen.js'
import MoneySavedScreen from './screens/MoneySavedScreen.js'
import CookingScreen from './screens/CookingScreen.js' 
import styles from './styles.js'

// Import AuthProvider and useAuth
import { AuthProvider, useAuth } from './data/AuthContext'

const services = [
  { 
    id: '1', 
    title: 'Inventory', 
    subtitle: 'Track your food items',
    icon: '📦',
    gradient: ['#667eea', '#764ba2']
  },
  { 
    id: '2', 
    title: 'Smart Meal Plan', 
    subtitle: 'AI-powered suggestions',
    icon: '🤖',
    gradient: ['#f093fb', '#f5576c']
  },
  { 
    id: '3', 
    title: 'Money Saved', 
    subtitle: 'Track your savings',
    icon: '💰',
    gradient: ['#4facfe', '#00f2fe']
  },
  { 
    id: '4', 
    title: 'Cook', 
    subtitle: 'Delicious recipes at your fingertips',
    icon: '🍳',
    gradient: ['#43e97b', '#38f9d7']
  },
]

// Mock data for soon to expire items
const soonToExpireItems = [
  { id: '1', name: 'Tomatoes', daysLeft: 2, icon: '🍅' },
  { id: '2', name: 'Milk', daysLeft: 1, icon: '🥛' },
  { id: '3', name: 'Bread', daysLeft: 3, icon: '🍞' },
  { id: '4', name: 'Bananas', daysLeft: 2, icon: '🍌' },
]

// Main App Component (wrapped with AuthProvider)
function MainApp() {
  // Get auth state and functions
  const { isAuthenticated, isLoading, logout, user, getUsername, getUserId } = useAuth()
  
  const [currentScreen, setCurrentScreen] = useState('home')
  const savingsData = [250, 10, 40, 95, 85, 91, 35, 12, 56, 42, 77, 23, 67, 12, 78, 21, 53, 75, 21, 11]
  
  // Calculate total savings
  const totalSavings = savingsData.reduce((sum, amount) => sum + amount, 0)
  
  // Format as Philippine Peso with smart abbreviations
  const formatToPHP = (amount) => {
    if (amount >= 1000000) {
      return `₱${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `₱${(amount / 1000).toFixed(1)}K`
    } else {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
  }

  const handleServicePress = (serviceTitle) => {
    if (serviceTitle === 'Donation') {
      setCurrentScreen('donation')
    } else if (serviceTitle === 'Inventory') {
      setCurrentScreen('inventory')
    } else if (serviceTitle === 'Smart Meal Plan') {
      setCurrentScreen('smartmealplan')
    } else if (serviceTitle === 'Money Saved') {
      setCurrentScreen('moneysaved')
    } else if (serviceTitle === 'Cook') {
      setCurrentScreen('cook')
    }
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
  }

  const handleBottomNavPress = (navItem) => {
    if (navItem === 'premium') {
      alert('Premium subscription coming soon! Get access to exclusive features.')
    } else if (navItem === 'profile') {
      setCurrentScreen('profile')
    } else if (navItem === 'cart') {
      setCurrentScreen('cart')
    } else if (navItem === 'home') {
      setCurrentScreen('home')
    } else {
      console.log(`Pressed ${navItem}`)
    }
  }

  const handleAvatarPress = () => {
    setCurrentScreen('profile')
  }

  const handleLogout = async () => {
    await logout()
    setCurrentScreen('home')
    // AuthContext will automatically show LoginScreen
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    )
  }

  // Show login screen if not logged in
  if (!isAuthenticated) {
    return <LoginScreen />
  }

  // Handle screens
  if (currentScreen === 'donation') {
    return <DonationScreen onBack={handleBackToHome} userSavings={totalSavings} />
  }
  if (currentScreen === 'inventory') {
    return <InventoryScreen navigation={{ goBack: handleBackToHome }} />
  }
  if (currentScreen === 'profile') {
    return <ProfileScreen 
      navigation={{ goBack: handleBackToHome }} 
      onLogout={handleLogout}
    />
  }
  if (currentScreen === 'cart') {
    return <CartScreen navigation={{ goBack: handleBackToHome }} />
  }
  if (currentScreen === 'smartmealplan') {
    return <SmartMealPlanScreen 
      navigation={{ goBack: handleBackToHome }} 
      userInventory={soonToExpireItems}
    />
  }
  if (currentScreen === 'moneysaved') {
    return <MoneySavedScreen 
      navigation={{ goBack: handleBackToHome }} 
    />
  }
  if (currentScreen === 'cook') {
    return <CookingScreen 
      navigation={{ goBack: handleBackToHome }} 
    />
  }

  // Home Screen
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header with enhanced greeting - now shows actual username */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleAvatarPress}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100' }}
                  style={styles.avatar}
                />
                <View style={styles.onlineIndicator} />
              </View>
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hello, {getUsername() || 'User'}! 👋</Text>
              <Text style={styles.subGreeting}>Let's reduce food waste today</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Impact Summary Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <View>
              <Text style={styles.impactTitle}>Your Impact Today</Text>
              <Text style={styles.impactSubtitle}>Making a difference, one meal at a time</Text>
            </View>
            <Text style={styles.impactEmoji}>🌍</Text>
          </View>
          <View style={styles.impactStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Items Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.3kg</Text>
              <Text style={styles.statLabel}>CO₂ Reduced</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatToPHP(2451)}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
          </View>
        </View>

        {/* Hero Section with improved design */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Help Feed Families</Text>
              <Text style={styles.heroSubtitle}>Turn your excess food into hope for others</Text>
              <TouchableOpacity 
                style={styles.donateNowButton}
                onPress={() => handleServicePress('Donation')}
              >
                <Text style={styles.donateNowText}>Donate Now</Text>
                <Text style={styles.buttonIcon}>❤️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Modern Services Grid */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Discover Features</Text>
          <Text style={styles.sectionSubtitle}>Everything you need to reduce food waste</Text>
          
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity 
                key={service.id} 
                style={[
                  styles.modernServiceCard,
                  index % 2 === 0 ? styles.leftCard : styles.rightCard
                ]}
                onPress={() => handleServicePress(service.title)}
              >
                <View style={styles.serviceIconContainer}>
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </View>
                <View style={styles.serviceArrow}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Soon to Expire Section */}
        <View style={styles.soonToExpireSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.soonToExpireTitle}>⏰ Soon to Expire</Text>
              <Text style={styles.soonToExpireSubtitle}>Use these items first</Text>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.expiringItemsContainer}>
              {soonToExpireItems.map(item => (
                <TouchableOpacity key={item.id} style={styles.expiringItemCard}>
                  <View style={styles.itemIconContainer}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.expiringItemName}>{item.name}</Text>
                  <View style={[
                    styles.daysLeftContainer,
                    item.daysLeft === 1 ? styles.urgentDays : 
                    item.daysLeft === 2 ? styles.soonDays : styles.normalDays
                  ]}>
                    <Text style={[
                      styles.expiringItemDays,
                      item.daysLeft === 1 ? styles.urgentDaysText : 
                      item.daysLeft === 2 ? styles.soonDaysText : styles.normalDaysText
                    ]}>
                      {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

      </ScrollView>
      
      {/* Enhanced Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('home')}
        >
          <View style={[
            styles.bottomNavIcon, 
            currentScreen === 'home' && styles.activeBottomNavIcon
          ]}>
            <Text style={styles.bottomNavIconText}>🏠</Text>
          </View>
          <Text style={[
            styles.bottomNavLabel, 
            currentScreen === 'home' && styles.activeBottomNavLabel
          ]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('profile')}
        >
          <View style={[
            styles.bottomNavIcon,
            currentScreen === 'profile' && styles.activeBottomNavIcon
          ]}>
            <Text style={styles.bottomNavIconText}>👤</Text>
          </View>
          <Text style={[
            styles.bottomNavLabel,
            currentScreen === 'profile' && styles.activeBottomNavLabel
          ]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('cart')}
        >
          <View style={[
            styles.bottomNavIcon,
            currentScreen === 'cart' && styles.activeBottomNavIcon
          ]}>
            <Text style={styles.bottomNavIconText}>🛒</Text>
          </View>
          <Text style={[
            styles.bottomNavLabel,
            currentScreen === 'cart' && styles.activeBottomNavLabel
          ]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('premium')}
        >
          <View style={[styles.bottomNavIcon, styles.premiumBottomNavIcon]}>
            <Text style={styles.bottomNavIconText}>⭐</Text>
          </View>
          <Text style={[styles.bottomNavLabel, styles.premiumBottomNavLabel]}>Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Root App Component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}