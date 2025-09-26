import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles/donationStyles.js'

const charitiesData = require('./charities.json')

const DonationScreen = ({ onBack, userSavings }) => {
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [donationType, setDonationType] = useState(null)
  const [charities, setCharities] = useState([])

  useEffect(() => {
    // Load charities from JSON file
    setCharities(charitiesData.charities)
  }, [])

  const handleCharitySelect = (charity) => {
    setSelectedCharity(charity)
    setDonationType(null) // Reset donation type when selecting new charity
  }

  const handleDonationTypeSelect = (type) => {
    setDonationType(type)
  }

  const handleDonate = () => {
    if (selectedCharity && donationType) {
      // Here you would handle the actual donation logic
      alert(`Thank you! Your ${donationType} donation to ${selectedCharity.name} has been processed.`)
      onBack()
    }
  }

  const getCharityIcon = (type) => {
    switch(type) {
      case 'Local Government Unit': return '🏛️'
      case 'NGO': return '🤝'
      case 'Community Organization': return '👥'
      default: return '❤️'
    }
  }

  return (
    <View style={styles.donationContainer}>
      {/* Header */}
      <View style={styles.donationHeader}>
        <View style={styles.donationTitleContainer}>
          <Text style={styles.donationTitle}>Turn your food savings into meals for others</Text>
          <Text style={styles.donationSubtitle}>Your current savings: ₱{userSavings}</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={onBack}>
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.donationContent} showsVerticalScrollIndicator={false}>
        {/* Charities Section */}
        <Text style={styles.sectionTitle}>Choose a Charity or LGU</Text>
        <View style={styles.charitiesGrid}>
          {charities.map(charity => (
            <TouchableOpacity 
              key={charity.id} 
              style={[
                styles.charityCard, 
                { borderColor: charity.color },
                selectedCharity?.id === charity.id && { backgroundColor: charity.color + '20' }
              ]}
              onPress={() => handleCharitySelect(charity)}
            >
              <View style={[styles.charityIcon, { backgroundColor: charity.color }]}>
                <Text style={styles.charityIconText}>
                  {getCharityIcon(charity.type)}
                </Text>
              </View>
              <Text style={styles.charityName}>{charity.name}</Text>
              <Text style={styles.charityType}>{charity.type}</Text>
              <Text style={styles.charityDescription}>{charity.description}</Text>
              <View style={styles.charityStats}>
                <Text style={styles.charityLocation}>📍 {charity.location}</Text>
                <Text style={styles.charityBeneficiaries}>👨‍👩‍👧‍👦 {charity.beneficiaries}</Text>
              </View>
              <View style={styles.charityDetails}>
                <Text style={styles.charityPrograms}>
                  Programs: {charity.programs.join(', ')}
                </Text>
                <Text style={styles.charityContact}>📧 {charity.contact}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Donation Type Section */}
        {selectedCharity && (
          <View style={styles.donationTypeSection}>
            <Text style={styles.sectionTitle}>Choose Donation Type for {selectedCharity.name}</Text>
            <View style={styles.donationTypes}>
              {selectedCharity.acceptsMoney && (
                <TouchableOpacity 
                  style={[
                    styles.donationTypeCard,
                    donationType === 'money' && styles.selectedDonationType
                  ]}
                  onPress={() => handleDonationTypeSelect('money')}
                >
                  <Text style={styles.donationTypeIcon}>💰</Text>
                  <Text style={styles.donationTypeTitle}>Money Donation</Text>
                  <Text style={styles.donationTypeDesc}>
                    Donate part of your savings to help purchase meals
                  </Text>
                  <Text style={styles.suggestedAmount}>
                    Suggested: ₱{Math.floor(userSavings * 0.1)} - ₱{Math.floor(userSavings * 0.2)}
                  </Text>
                </TouchableOpacity>
              )}

              {selectedCharity.acceptsFood && (
                <TouchableOpacity 
                  style={[
                    styles.donationTypeCard,
                    donationType === 'food' && styles.selectedDonationType
                  ]}
                  onPress={() => handleDonationTypeSelect('food')}
                >
                  <Text style={styles.donationTypeIcon}>🍱</Text>
                  <Text style={styles.donationTypeTitle}>Food Donation</Text>
                  <Text style={styles.donationTypeDesc}>
                    Donate actual food items or prepared meals
                  </Text>
                  <Text style={styles.suggestedAmount}>
                    Examples: Rice, canned goods, fresh produce
                  </Text>
                </TouchableOpacity>
              )}

              {!selectedCharity.acceptsMoney && !selectedCharity.acceptsFood && (
                <Text style={styles.noAcceptedDonations}>
                  This charity is currently not accepting donations through our platform.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Donate Button */}
        {selectedCharity && donationType && (
          <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
            <Text style={styles.donateButtonText}>
              Donate {donationType === 'money' ? 'Money' : 'Food'} to {selectedCharity.name}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

export default DonationScreen