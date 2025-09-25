import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  Switch
} from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [donationReminders, setDonationReminders] = useState(true);

  const userStats = {
    totalSavings: 1250,
    foodSaved: 45,
    donationsMade: 12,
    impactScore: 850
  };

  const formatToPHP = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
          // Handle logout logic here
          Alert.alert("Logged out successfully!");
        }}
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const MenuItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Text style={styles.menuIconText}>{icon}</Text>
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <Text style={styles.menuArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Discaya</Text>
          <Text style={styles.profileEmail}>discaya@foodsaver.com</Text>
          <Text style={styles.memberSince}>Member since January 2024</Text>
        </View>

        {/* Impact Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatToPHP(userStats.totalSavings)}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userStats.foodSaved}kg</Text>
              <Text style={styles.statLabel}>Food Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userStats.donationsMade}</Text>
              <Text style={styles.statLabel}>Donations Made</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userStats.impactScore}</Text>
              <Text style={styles.statLabel}>Impact Score</Text>
            </View>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementSection}>
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Food Hero</Text>
              <Text style={styles.achievementSubtitle}>You've prevented 45kg of food waste!</Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="📊"
            title="My Statistics"
            subtitle="View detailed impact reports"
            onPress={() => Alert.alert("Statistics", "Detailed statistics coming soon!")}
          />
          
          <MenuItem
            icon="💚"
            title="Donation History"
            subtitle="Track your food donations"
            onPress={() => Alert.alert("Donation History", "View all your past donations")}
          />
          
          <MenuItem
            icon="🎯"
            title="Goals & Challenges"
            subtitle="Set and track your sustainability goals"
            onPress={() => Alert.alert("Goals", "Goal setting feature coming soon!")}
          />
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <MenuItem
            icon="🔔"
            title="Notifications"
            subtitle="Expiry alerts and reminders"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#2ECC71' }}
                thumbColor={notificationsEnabled ? '#fff' : '#fff'}
              />
            }
          />
          
          <MenuItem
            icon="💝"
            title="Donation Reminders"
            subtitle="Get reminded to donate surplus food"
            rightElement={
              <Switch
                value={donationReminders}
                onValueChange={setDonationReminders}
                trackColor={{ false: '#D1D5DB', true: '#2ECC71' }}
                thumbColor={donationReminders ? '#fff' : '#fff'}
              />
            }
          />
          
          <MenuItem
            icon="🌍"
            title="Language & Region"
            subtitle="Philippines (English)"
            onPress={() => Alert.alert("Language", "Language settings coming soon!")}
          />
          
          <MenuItem
            icon="🛡️"
            title="Privacy & Security"
            subtitle="Manage your data and privacy"
            onPress={() => Alert.alert("Privacy", "Privacy settings coming soon!")}
          />
          
          <MenuItem
            icon="❓"
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={() => Alert.alert("Support", "Contact support: help@foodsaver.com")}
          />
          
          <MenuItem
            icon="ℹ️"
            title="About FoodSaver"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert("About", "FoodSaver - Fighting food waste together!")}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom padding for scroll */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#4A56E2',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2ECC71',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementSection: {
    marginBottom: 20,
  },
  achievementBadge: {
    backgroundColor: '#FFF3CD',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  achievementIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8860B',
    marginBottom: 5,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#8B7355',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});

export default ProfileScreen;