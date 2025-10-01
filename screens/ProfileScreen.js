import React, { useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,Image,Alert,Switch} from 'react-native';
import styles from './styles/profileScreenStyles';

const ProfileScreen = ({ navigation, onLogout }) => {
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
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            if (onLogout) {
              onLogout(); // This will take user back to login screen
            }
          }
        }
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

export default ProfileScreen;