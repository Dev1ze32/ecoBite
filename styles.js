import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Hero Section Styles
  heroSection: {
    position: 'relative',
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  donateNowButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  donateNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Services Section - Updated Grid Layout
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  newServiceCard: {
    width: '47%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },

  // Soon to Expire Section
  soonToExpireSection: {
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  soonToExpireTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  expiringItemsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  expiringItemCard: {
    backgroundColor: '#FFE082',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  expiringItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expiringItemDays: {
    fontSize: 12,
    color: '#666',
  },

  // Bottom Navigation - Fixed for Android
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 25 : 15, // Add extra padding for Android navigation bar
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeBottomNavIcon: {
    backgroundColor: '#4A56E2',
  },
  premiumBottomNavIcon: {
    backgroundColor: '#FFD700',
  },
  bottomNavIconText: {
    fontSize: 18,
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeBottomNavLabel: {
    color: '#4A56E2',
    fontWeight: '600',
  },
  premiumBottomNavLabel: {
    color: '#FFD700',
    fontWeight: '600',
  },

  // Original styles (keeping all existing styles)
  statBox: {
    backgroundColor: '#2ECC71',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    paddingVertical: 10,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#fff',
    borderRadius: 4,
    opacity: 0.9,
    marginVertical: 2,
  },
  barValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  barIndex: {
    color: '#fff',
    fontSize: 9,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  chartLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 8,
    opacity: 0.9,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 1,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  serviceText: {
    color: '#fff',
    fontWeight: '600',
  },
})

export default styles