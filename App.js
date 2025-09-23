import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import styles from './styles.js'

const services = [
  { id: '1', title: 'Inventory', color: '#FF6B6B' },
  { id: '2', title: 'Meal Plan', color: '#4ECDC4' },
  { id: '3', title: 'Donation', color: '#FFD93D' },
  { id: '4', title: 'AI Assist', color: '#6C5CE7' },
  { id: '5', title: 'Discount Finder', color: '#2ECC71' },
  { id: '6', title: 'Impact tracket', color: '#F39C12'}
]

const activities = [
  { id: '1', title: 'Donated 3 meals', detail: 'Local Food Bank', amount: null },
  { id: '2', title: 'Used leftovers', detail: 'Saved ₱600 this week', amount: '+₱600' },
  { id: '3', title: 'Grocery Spend', detail: 'Last trip: ₱3,250', amount: '-₱3,250' },
  { id: '4', title: 'Meal prep completed', detail: 'Prepared 5 meals for the week', amount: '+₱1,250' },
  { id: '5', title: 'Found discount', detail: '30% off at Green Market', amount: '+₱900' },
  { id: '6', title: 'Shared recipe', detail: 'Helped neighbor reduce waste', amount: null },
  { id: '7', title: 'Composted food scraps', detail: 'Reduced waste by 2lbs', amount: null },
  { id: '8', title: 'Bulk purchase', detail: 'Rice and beans for month', amount: '+₱2,250' },
  { id: '9', title: 'Used food app', detail: 'Found expiring items nearby', amount: '+₱400' },
  { id: '10', title: 'Donated surplus', detail: 'Community Kitchen', amount: null },
  { id: '11', title: 'Planned meals', detail: 'Weekly meal planning session', amount: '+₱750' },
  { id: '12', title: 'Grocery shopping', detail: 'Weekly essentials', amount: '-₱3,900' },
]

const SimpleChart = ({ data }) => {
  const maxValue = Math.max(...data)
  const minBarWidth = 25 // Minimum width for each bar
  const barSpacing = 8 // Space between bars
  const totalWidth = data.length * (minBarWidth + barSpacing)
  
  return (
    <View style={styles.chartContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View style={[styles.chartWrapper, { width: totalWidth }]}>
          {data.map((value, index) => (
            <View key={index} style={[styles.barContainer, { width: minBarWidth }]}>
              <Text style={styles.barValue}>₱{value}</Text>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: Math.max((value / maxValue) * 60, 5), // Minimum height of 5
                    width: minBarWidth - 5
                  }
                ]} 
              />
              <Text style={styles.barIndex}>D{index + 1}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.chartLabel}>Daily Savings Progress (Scroll to see more)</Text>
    </View>
  )
}

export default function App() {
  const savingsData = [50, 10, 40, 95, 85, 91, 35, 12, 56, 42, 77, 23, 67, 12, 78, 21, 53, 75, 21, 11]
  
  // Calculate total savings
  const totalSavings = savingsData.reduce((sum, amount) => sum + amount, 0)
  
  // Format as Philippine Peso
  const formatToPHP = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hello, One Achmad</Text>
      </View>

      {/* Statistic / Balance Box */}
      <View style={styles.statBox}>
        <Text style={styles.statTitle}>This Month's Savings</Text>
        <SimpleChart data={savingsData} />
        <Text style={styles.statValue}>{formatToPHP(totalSavings)} Saved</Text>
      </View>

      {/* Services */}
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.servicesRow}>
        {services.map(service => (
          <TouchableOpacity key={service.id} style={[styles.serviceCard, { backgroundColor: service.color }]}>
            <Text style={styles.serviceText}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activitiesContainer}>
        <FlatList
          data={activities}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDetail}>{item.detail}</Text>
              {item.amount && (
                <Text style={[
                  styles.activityAmount, 
                  { color: item.amount.startsWith('+') ? '#2ECC71' : '#E74C3C' }
                ]}>
                  {item.amount}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  )
}