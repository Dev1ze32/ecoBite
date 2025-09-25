import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'
import React, { useState } from 'react'

const { width } = Dimensions.get('window')

// Mock data for user's impact
const impactData = {
  totalStats: {
    foodSaved: 12.4, // kg of food saved from waste
    co2Prevented: 15.2, // kg CO2 equivalent
    waterSaved: 234, // liters
    mealsCreated: 28,
    donationsMade: 8,
    familiesHelped: 12,
    daysActive: 45
  },
  monthlyProgress: {
    thisMonth: { foodSaved: 3.2, co2Prevented: 4.1, donations: 3 },
    lastMonth: { foodSaved: 2.8, co2Prevented: 3.6, donations: 2 }
  },
  achievements: [
    { id: 1, title: 'Food Saver', description: 'Saved 10kg of food from waste', icon: '🥕', unlocked: true },
    { id: 2, title: 'Eco Warrior', description: 'Prevented 15kg CO2 emissions', icon: '🌍', unlocked: true },
    { id: 3, title: 'Community Helper', description: 'Made 5 donations', icon: '❤️', unlocked: true },
    { id: 4, title: 'Waste Reducer', description: 'Active for 30+ days', icon: '♻️', unlocked: true },
    { id: 5, title: 'Meal Creator', description: 'Created 50 meals from saved food', icon: '🍽️', unlocked: false },
    { id: 6, title: 'Impact Champion', description: 'Helped 20+ families', icon: '🏆', unlocked: false }
  ],
  comparisons: {
    treesEquivalent: 2.3, // equivalent trees planted
    carMilesAvoided: 65, // miles not driven
    phoneCharges: 1840 // phone charges worth of energy saved
  }
}

const MyImpactScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('total')

  const renderImpactCard = (title, value, unit, subtitle, icon, color) => (
    <View style={[styles.impactCard, { borderTopColor: color }]}>
      <View style={styles.impactCardHeader}>
        <Text style={styles.impactIcon}>{icon}</Text>
        <View style={styles.impactCardText}>
          <Text style={[styles.impactValue, { color }]}>{value}</Text>
          <Text style={styles.impactUnit}>{unit}</Text>
        </View>
      </View>
      <Text style={styles.impactTitle}>{title}</Text>
      <Text style={styles.impactSubtitle}>{subtitle}</Text>
    </View>
  )

  const renderAchievement = (achievement) => (
    <View 
      key={achievement.id} 
      style={[
        styles.achievementCard, 
        !achievement.unlocked && styles.achievementLocked
      ]}
    >
      <Text style={[
        styles.achievementIcon, 
        !achievement.unlocked && styles.achievementIconLocked
      ]}>
        {achievement.icon}
      </Text>
      <View style={styles.achievementText}>
        <Text style={[
          styles.achievementTitle,
          !achievement.unlocked && styles.achievementTitleLocked
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !achievement.unlocked && styles.achievementDescriptionLocked
        ]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.unlocked && (
        <Text style={styles.achievementBadge}>✓</Text>
      )}
    </View>
  )

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
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
        <Text style={styles.headerTitle}>My Impact</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>You're Making a Difference! 🌟</Text>
          <Text style={styles.heroSubtitle}>
            Your food waste prevention efforts are creating positive change
          </Text>
          
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>{impactData.totalStats.foodSaved}</Text>
              <Text style={styles.heroStatUnit}>kg food saved</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>{impactData.totalStats.familiesHelped}</Text>
              <Text style={styles.heroStatUnit}>families helped</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>{impactData.totalStats.daysActive}</Text>
              <Text style={styles.heroStatUnit}>days active</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={[styles.periodTab, selectedPeriod === 'total' && styles.activePeriodTab]}
            onPress={() => setSelectedPeriod('total')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'total' && styles.activePeriodText]}>
              All Time
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.periodTab, selectedPeriod === 'month' && styles.activePeriodTab]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.activePeriodText]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Impact Cards Grid */}
        <View style={styles.impactGrid}>
          {selectedPeriod === 'total' ? (
            <>
              {renderImpactCard(
                'Food Saved', 
                impactData.totalStats.foodSaved, 
                'kg', 
                'prevented from going to waste',
                '🥕', 
                '#2ECC71'
              )}
              {renderImpactCard(
                'CO₂ Prevented', 
                impactData.totalStats.co2Prevented, 
                'kg', 
                'carbon emissions avoided',
                '🌍', 
                '#3498DB'
              )}
              {renderImpactCard(
                'Water Saved', 
                impactData.totalStats.waterSaved, 
                'liters', 
                'water footprint reduced',
                '💧', 
                '#1ABC9C'
              )}
              {renderImpactCard(
                'Meals Created', 
                impactData.totalStats.mealsCreated, 
                'meals', 
                'from rescued ingredients',
                '🍽️', 
                '#E74C3C'
              )}
              {renderImpactCard(
                'Donations Made', 
                impactData.totalStats.donationsMade, 
                'times', 
                'shared food with others',
                '❤️', 
                '#9B59B6'
              )}
              {renderImpactCard(
                'Families Helped', 
                impactData.totalStats.familiesHelped, 
                'families', 
                'received food donations',
                '🏠', 
                '#F39C12'
              )}
            </>
          ) : (
            <>
              {renderImpactCard(
                'Food Saved', 
                impactData.monthlyProgress.thisMonth.foodSaved, 
                'kg', 
                `${calculateGrowth(
                  impactData.monthlyProgress.thisMonth.foodSaved,
                  impactData.monthlyProgress.lastMonth.foodSaved
                )}% vs last month`,
                '🥕', 
                '#2ECC71'
              )}
              {renderImpactCard(
                'CO₂ Prevented', 
                impactData.monthlyProgress.thisMonth.co2Prevented, 
                'kg', 
                `${calculateGrowth(
                  impactData.monthlyProgress.thisMonth.co2Prevented,
                  impactData.monthlyProgress.lastMonth.co2Prevented
                )}% vs last month`,
                '🌍', 
                '#3498DB'
              )}
              {renderImpactCard(
                'Donations Made', 
                impactData.monthlyProgress.thisMonth.donations, 
                'times', 
                `${calculateGrowth(
                  impactData.monthlyProgress.thisMonth.donations,
                  impactData.monthlyProgress.lastMonth.donations
                )}% vs last month`,
                '❤️', 
                '#9B59B6'
              )}
            </>
          )}
        </View>

        {/* Real World Comparisons */}
        <View style={styles.comparisonsSection}>
          <Text style={styles.sectionTitle}>Real World Impact</Text>
          <Text style={styles.sectionSubtitle}>Your impact is equivalent to:</Text>
          
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>🌳</Text>
              <View style={styles.comparisonText}>
                <Text style={styles.comparisonValue}>{impactData.comparisons.treesEquivalent}</Text>
                <Text style={styles.comparisonLabel}>trees planted</Text>
              </View>
            </View>
            
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>🚗</Text>
              <View style={styles.comparisonText}>
                <Text style={styles.comparisonValue}>{impactData.comparisons.carMilesAvoided}</Text>
                <Text style={styles.comparisonLabel}>car miles avoided</Text>
              </View>
            </View>
            
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonIcon}>📱</Text>
              <View style={styles.comparisonText}>
                <Text style={styles.comparisonValue}>{impactData.comparisons.phoneCharges}</Text>
                <Text style={styles.comparisonLabel}>phone charges saved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.sectionSubtitle}>Unlock badges as you make more impact</Text>
          
          <View style={styles.achievementsList}>
            {impactData.achievements.map(renderAchievement)}
          </View>
        </View>

        {/* Encouragement Section */}
        <View style={styles.encouragementSection}>
          <View style={styles.encouragementCard}>
            <Text style={styles.encouragementIcon}>🌟</Text>
            <Text style={styles.encouragementTitle}>Keep Up the Great Work!</Text>
            <Text style={styles.encouragementText}>
              Every small action counts. You're not just saving food - you're helping the planet and feeding families in need.
            </Text>
          </View>
        </View>

        {/* Next Goals */}
        <View style={styles.nextGoalsSection}>
          <Text style={styles.sectionTitle}>Your Next Goals</Text>
          
          <View style={styles.goalCard}>
            <Text style={styles.goalIcon}>🎯</Text>
            <View style={styles.goalText}>
              <Text style={styles.goalTitle}>Save 20kg of food</Text>
              <Text style={styles.goalProgress}>
                {impactData.totalStats.foodSaved}/20kg ({Math.round((impactData.totalStats.foodSaved/20)*100)}%)
              </Text>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgressFill, 
                    { width: `${Math.min((impactData.totalStats.foodSaved/20)*100, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <Text style={styles.goalIcon}>🤝</Text>
            <View style={styles.goalText}>
              <Text style={styles.goalTitle}>Help 20 families</Text>
              <Text style={styles.goalProgress}>
                {impactData.totalStats.familiesHelped}/20 families ({Math.round((impactData.totalStats.familiesHelped/20)*100)}%)
              </Text>
              <View style={styles.goalProgressBar}>
                <View 
                  style={[
                    styles.goalProgressFill, 
                    { width: `${Math.min((impactData.totalStats.familiesHelped/20)*100, 100)}%` }
                  ]} 
                />
              </View>
            </View>
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
    color: '#6C5CE7',
    fontWeight: '500',
  },

  placeholder: {
    width: 60,
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
    backgroundColor: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    backgroundColor: '#6C5CE7',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 30,
  },

  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroStat: {
    alignItems: 'center',
  },

  heroStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },

  heroStatUnit: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },

  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#fff',
    opacity: 0.3,
    marginHorizontal: 20,
  },

  // Period Selector
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 25,
    padding: 4,
  },

  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },

  activePeriodTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  activePeriodText: {
    color: '#6C5CE7',
    fontWeight: '600',
  },

  // Impact Grid
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  impactCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  impactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  impactIcon: {
    fontSize: 24,
    marginRight: 8,
  },

  impactCardText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  impactUnit: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },

  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },

  impactSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },

  // Comparisons Section
  comparisonsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  comparisonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  comparisonIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  comparisonText: {
    flex: 1,
  },

  comparisonValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  comparisonLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  // Achievements Section
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  achievementsList: {
    // No additional styles needed
  },

  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  achievementLocked: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },

  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  achievementIconLocked: {
    opacity: 0.5,
  },

  achievementText: {
    flex: 1,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },

  achievementTitleLocked: {
    color: '#999',
  },

  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },

  achievementDescriptionLocked: {
    color: '#999',
  },

  achievementBadge: {
    backgroundColor: '#2ECC71',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
  },

  // Encouragement Section
  encouragementSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  encouragementCard: {
    backgroundColor: 'linear-gradient(135deg, #2ECC71, #27AE60)',
    backgroundColor: '#2ECC71',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },

  encouragementIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  encouragementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },

  encouragementText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },

  // Next Goals Section
  nextGoalsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  goalIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  goalText: {
    flex: 1,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },

  goalProgress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  goalProgressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },

  goalProgressFill: {
    height: 8,
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
})

export default MyImpactScreen