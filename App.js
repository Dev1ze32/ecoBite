import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import DonationScreen from './screens/DonationScreen'
import InventoryScreen from './screens/InventoryScreen.js'
import styles from './styles.js'

const services = [
  { id: '1', title: 'Inventory', color: '#FF6B6B' },
  { id: '2', title: 'Smart Meal Plan', color: '#4ECDC4' },
  { id: '3', title: 'Discounts', color: '#2ECC71' },
  { id: '4', title: 'My Impact', color: '#6C5CE7' },
]

// Mock data for soon to expire items
const soonToExpireItems = [
  { id: '1', name: 'Tomatoes', daysLeft: 2 },
  { id: '2', name: 'Milk', daysLeft: 1 },
  { id: '3', name: 'Bread', daysLeft: 3 },
  { id: '4', name: 'Bananas', daysLeft: 2 },
]

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const savingsData = [250, 10, 40, 95, 85, 91, 35, 12, 56, 42, 77, 23, 67, 12, 78, 21, 53, 75, 21, 11]
  
  // Calculate total savings
  const totalSavings = savingsData.reduce((sum, amount) => sum + amount, 0)
  
  // Format as Philippine Peso
  const formatToPHP = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const handleServicePress = (serviceTitle) => {
    if (serviceTitle === 'Donation') {
      setCurrentScreen('donation')
    } else if (serviceTitle === 'Inventory') {
      setCurrentScreen('inventory')
    }
    // Other services don't have functionality yet
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
  }

  const handleBottomNavPress = (navItem) => {
    // Bottom navigation functionality
    if (navItem === 'premium') {
      // Show premium subscription modal/screen
      alert('Premium subscription coming soon! Get access to exclusive features.')
    } else {
      console.log(`Pressed ${navItem}`)
    }
  }



  // Handle screens
  if (currentScreen === 'donation') {
    return <DonationScreen onBack={handleBackToHome} userSavings={totalSavings} />
  }
  if (currentScreen === 'inventory') {
    return <InventoryScreen navigation={{ goBack: handleBackToHome }} />
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 120 }} // Add padding for bottom nav
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Hello, Discaya</Text>
        </View>

        {/* Hero Section with Donation Call-to-Action */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Help feed families in need</Text>
            <TouchableOpacity 
              style={styles.donateNowButton}
              onPress={() => handleServicePress('Donation')}
            >
              <Text style={styles.donateNowText}>Donate now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.newServiceCard, { backgroundColor: service.color }]}
              onPress={() => handleServicePress(service.title)}
            >
              <Text style={styles.serviceText}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Soon to Expire Section */}
        <View style={styles.soonToExpireSection}>
          <Text style={styles.soonToExpireTitle}>Soon to expire</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.expiringItemsContainer}>
              {soonToExpireItems.map(item => (
                <View key={item.id} style={styles.expiringItemCard}>
                  <Text style={styles.expiringItemName}>{item.name}</Text>
                  <Text style={styles.expiringItemDays}>{item.daysLeft} days left</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>


      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('home')}
        >
          <View style={[styles.bottomNavIcon, styles.activeBottomNavIcon]}>
            <Text style={styles.bottomNavIconText}>🏠</Text>
          </View>
          <Text style={[styles.bottomNavLabel, styles.activeBottomNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('profile')}
        >
          <View style={styles.bottomNavIcon}>
            <Text style={styles.bottomNavIconText}>👤</Text>
          </View>
          <Text style={styles.bottomNavLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('cart')}
        >
          <View style={styles.bottomNavIcon}>
            <Text style={styles.bottomNavIconText}>🛒</Text>
          </View>
          <Text style={styles.bottomNavLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => handleBottomNavPress('premium')}
        >
          <View style={[styles.bottomNavIcon, styles.premiumBottomNavIcon]}>
            <Text style={styles.bottomNavIconText}>👑</Text>
          </View>
          <Text style={[styles.bottomNavLabel, styles.premiumBottomNavLabel]}>Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}