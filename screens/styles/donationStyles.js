import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // Donation Screen Styles
  donationContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  donationHeader: {
    backgroundColor: '#2ECC71',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  donationTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  donationTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  donationSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  donationContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  charitiesGrid: {
    marginBottom: 30,
  },
  charityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  charityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  charityIconText: {
    fontSize: 20,
  },
  charityName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  charityType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  charityDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  charityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  charityLocation: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  charityBeneficiaries: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  charityDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  charityPrograms: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    lineHeight: 16,
  },
  charityContact: {
    fontSize: 11,
    color: '#2ECC71',
    fontWeight: '500',
  },
  donationTypeSection: {
    marginBottom: 30,
  },
  donationTypes: {
    gap: 15,
  },
  donationTypeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedDonationType: {
    borderColor: '#2ECC71',
    backgroundColor: '#2ECC7110',
  },
  donationTypeIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  donationTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  donationTypeDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  suggestedAmount: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
  },
  noAcceptedDonations: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  donateButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})

export default styles