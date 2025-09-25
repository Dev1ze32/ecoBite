import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StyleSheet,
  Alert,
  Platform
} from 'react-native'
import React, { useState, useEffect } from 'react'

const { width } = Dimensions.get('window')

// Mock data for food value tracking (based on food items and their costs)
const foodValueData = {
  dailyFoodActions: [
    { 
      date: '2024-09-19', 
      cookedValue: 45, 
      wastePreventedValue: 38, 
      donatedValue: 0,
      itemsCooked: ['Tomatoes', 'Bread', 'Milk'],
      itemsDonated: []
    },
    { 
      date: '2024-09-20', 
      cookedValue: 32, 
      wastePreventedValue: 28, 
      donatedValue: 25,
      itemsCooked: ['Bananas', 'Rice'],
      itemsDonated: ['Canned Goods']
    },
    { 
      date: '2024-09-21', 
      cookedValue: 67, 
      wastePreventedValue: 54, 
      donatedValue: 0,
      itemsCooked: ['Vegetables', 'Chicken', 'Pasta'],
      itemsDonated: []
    },
    { 
      date: '2024-09-22', 
      cookedValue: 28, 
      wastePreventedValue: 25, 
      donatedValue: 40,
      itemsCooked: ['Leftover Rice'],
      itemsDonated: ['Excess Vegetables', 'Bread']
    },
    { 
      date: '2024-09-23', 
      cookedValue: 89, 
      wastePreventedValue: 76, 
      donatedValue: 0,
      itemsCooked: ['Fish', 'Vegetables', 'Fruit'],
      itemsDonated: []
    },
    { 
      date: '2024-09-24', 
      cookedValue: 54, 
      wastePreventedValue: 47, 
      donatedValue: 35,
      itemsCooked: ['Soup ingredients', 'Salad'],
      itemsDonated: ['Extra Rice']
    },
    { 
      date: '2024-09-25', 
      cookedValue: 73, 
      wastePreventedValue: 65, 
      donatedValue: 20,
      itemsCooked: ['Stir-fry', 'Smoothie ingredients'],
      itemsDonated: ['Surplus Fruits']
    },
  ],
  totalItemsTracked: 156,
  totalMealsCooked: 28,
  totalDonationsMade: 8,
  impactMetrics: {
    co2Prevented: 15.2, // kg of CO2 (calculated from food waste prevented)
    waterSaved: 234, // liters (calculated from food waste prevented)
    mealsEnabled: 23, // meals enabled through donations
    familiesReached: 12 // estimated families helped through donations
  }
}

const MoneySavedScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('week')
  const [totalCookedValue, setTotalCookedValue] = useState(0)
  const [totalWastePreventedValue, setTotalWastePreventedValue] = useState(0)
  const [totalDonatedValue, setTotalDonatedValue] = useState(0)

  useEffect(() => {
    // Calculate totals from food data
    const cooked = foodValueData.dailyFoodActions.reduce((sum, day) => sum + day.cookedValue, 0)
    const prevented = foodValueData.dailyFoodActions.reduce((sum, day) => sum + day.wastePreventedValue, 0)
    const donated = foodValueData.dailyFoodActions.reduce((sum, day) => sum + day.donatedValue, 0)
    
    setTotalCookedValue(cooked)
    setTotalWastePreventedValue(prevented)
    setTotalDonatedValue(donated)
  }, [])

  const formatToPHP = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleViewFoodLog = () => {
    Alert.alert(
      'Food Activity Log',
      'Here you can see all the food items you\'ve tracked, cooked, and donated with their calculated values.',
      [{ text: 'Got it!' }]
    )
  }

  const handleAddFoodData = () => {
    Alert.alert(
      'Add Food Data',
      'Track new food items by entering what you cooked, donated, or prevented from waste. The app will calculate the value automatically.',
      [{ text: 'Coming Soon!' }]
    )
  }

  const renderStatsCard = (title, value, subtitle, color, icon) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsCardContent}>
        <Text style={styles.statsIcon}>{icon}</Text>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
          <Text style={styles.statsSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  )

  const renderDailyBar = (day, index) => {
    const totalValue = day.cookedValue + day.wastePreventedValue + day.donatedValue
    const maxTotal = Math.max(...foodValueData.dailyFoodActions.map(d => 
      d.cookedValue + d.wastePreventedValue + d.donatedValue
    ))
    const barHeight = (totalValue / maxTotal) * 80
    
    return (
      <TouchableOpacity key={index} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          {/* Stacked bar showing cooked, prevented, donated */}
          <View style={styles.stackedBar}>
            {day.donatedValue > 0 && (
              <View 
                style={[
                  styles.barSegment, 
                  { 
                    height: (day.donatedValue / totalValue) * barHeight,
                    backgroundColor: '#FF6B6B' // Donation color
                  }
                ]} 
              />
            )}
            {day.wastePreventedValue > 0 && (
              <View 
                style={[
                  styles.barSegment, 
                  { 
                    height: (day.wastePreventedValue / totalValue) * barHeight,
                    backgroundColor: '#4ECDC4' // Waste prevented color
                  }
                ]} 
              />
            )}
            {day.cookedValue > 0 && (
              <View 
                style={[
                  styles.barSegment, 
                  { 
                    height: (day.cookedValue / totalValue) * barHeight,
                    backgroundColor: '#2ECC71' // Cooked color
                  }
                ]} 
              />
            )}
          </View>
        </View>
        <Text style={styles.barAmount}>{formatToPHP(totalValue)}</Text>
        <Text style={styles.barDate}>{formatDate(day.date)}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Value Tracker</Text>
        <TouchableOpacity onPress={handleAddFoodData} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroAmount}>
            {formatToPHP(totalCookedValue + totalWastePreventedValue + totalDonatedValue)}
          </Text>
          <Text style={styles.heroSubtitle}>Total Food Value Tracked</Text>
          <Text style={styles.heroDescription}>
            Calculated from food items you've logged this week
          </Text>
          
          {/* Value Breakdown */}
          <View style={styles.valueBreakdown}>
            <View style={styles.valueItem}>
              <View style={[styles.valueIndicator, { backgroundColor: '#2ECC71' }]} />
              <Text style={styles.valueLabel}>Cooked: {formatToPHP(totalCookedValue)}</Text>
            </View>
            <View style={styles.valueItem}>
              <View style={[styles.valueIndicator, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.valueLabel}>Waste Prevented: {formatToPHP(totalWastePreventedValue)}</Text>
            </View>
            <View style={styles.valueItem}>
              <View style={[styles.valueIndicator, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.valueLabel}>Donated: {formatToPHP(totalDonatedValue)}</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'week' && styles.activeTab]}
            onPress={() => setSelectedTab('week')}
          >
            <Text style={[styles.tabText, selectedTab === 'week' && styles.activeTabText]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'month' && styles.activeTab]}
            onPress={() => setSelectedTab('month')}
          >
            <Text style={[styles.tabText, selectedTab === 'month' && styles.activeTabText]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daily Food Value Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Daily Food Activity</Text>
          <Text style={styles.chartDescription}>
            Values calculated from your food tracking data
          </Text>
          
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
              <Text style={styles.legendText}>Cooked</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.legendText}>Waste Prevented</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>Donated</Text>
            </View>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chartContainer}
          >
            {foodValueData.dailyFoodActions.map((day, index) => renderDailyBar(day, index))}
          </ScrollView>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatsCard(
            'Items Tracked', 
            foodValueData.totalItemsTracked, 
            'food items logged',
            '#2ECC71',
            '📝'
          )}
          {renderStatsCard(
            'Meals Cooked', 
            foodValueData.totalMealsCooked, 
            'from tracked ingredients',
            '#4ECDC4',
            '🍳'
          )}
          {renderStatsCard(
            'Donations Made', 
            foodValueData.totalDonationsMade, 
            'food donations logged',
            '#FF6B6B',
            '❤️'
          )}
          {renderStatsCard(
            'CO₂ Impact', 
            `${foodValueData.impactMetrics.co2Prevented}kg`, 
            'prevented by your actions',
            '#6C5CE7',
            '🌍'
          )}
        </View>

        {/* Impact Summary */}
        <View style={styles.impactSection}>
          <Text style={styles.sectionTitle}>Your Impact Summary</Text>
          
          <View style={styles.impactCard}>
            <Text style={styles.impactCardTitle}>Food Waste Prevention Impact</Text>
            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>{foodValueData.impactMetrics.mealsEnabled}</Text>
                <Text style={styles.impactStatLabel}>Meals Enabled</Text>
                <Text style={styles.impactStatSubtext}>through donations</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>{foodValueData.impactMetrics.familiesReached}</Text>
                <Text style={styles.impactStatLabel}>Families Reached</Text>
                <Text style={styles.impactStatSubtext}>estimated impact</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewFoodLog}
            >
              <Text style={styles.actionButtonText}>📋 View Complete Food Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How Food Value is Calculated</Text>
          
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>📊 Tracking Method</Text>
            <Text style={styles.explanationText}>
              • Enter food items and their estimated cost{'\n'}
              • Mark items as cooked, donated, or saved from waste{'\n'}
              • App calculates total food value and environmental impact{'\n'}
              • No real money is stored - just food data calculations
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Track more food items to get better insights into your waste prevention efforts!
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },

  backButton: {
    padding: 8,
  },

  backButtonText: {
    fontSize: 16,
    color: '#2ECC71',
    fontWeight: '500',
  },

  addButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  heroAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },

  heroDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },

  valueBreakdown: {
    width: '100%',
  },

  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  valueIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  valueLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 25,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },

  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  activeTabText: {
    color: '#2ECC71',
    fontWeight: '600',
  },

  // Chart Section
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },

  chartDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: '#666',
  },

  chartContainer: {
    flexDirection: 'row',
  },

  barContainer: {
    alignItems: 'center',
    marginRight: 16,
  },

  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    width: 40,
  },

  stackedBar: {
    width: 24,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },

  barSegment: {
    width: '100%',
  },

  barAmount: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },

  barDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },

  // Stats Grid
  statsGrid: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statsIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  statsText: {
    flex: 1,
  },

  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 2,
  },

  statsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Impact Section
  impactSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  impactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  impactCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },

  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  impactStat: {
    alignItems: 'center',
  },

  impactStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ECC71',
  },

  impactStatLabel: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },

  impactStatSubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },

  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2ECC71',
  },

  actionButtonText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: '600',
  },

  // How It Works Section
  howItWorksSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  explanationCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },

  explanationText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
})

export default MoneySavedScreen