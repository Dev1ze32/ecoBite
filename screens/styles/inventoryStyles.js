import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header styles - FIXED PADDING ISSUE
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingTop: 50, // Reduced from 50 to 20 to fix excessive spacing
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Alerts section
  alertsContainer: {
    backgroundColor: '#FFF3CD',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },

  alertsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },

  expiredAlert: {
    fontSize: 14,
    color: '#721C24',
    backgroundColor: '#F8D7DA',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },

  expiringAlert: {
    fontSize: 14,
    color: '#856404',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 4,
  },

  // List container
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 80,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptySubText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },

  // Item styles
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },

  freshItem: {
    borderLeftColor: '#28A745',
  },

  expiringItem: {
    borderLeftColor: '#FFC107',
    backgroundColor: '#FFFEF7',
  },

  expiredItem: {
    borderLeftColor: '#DC3545',
    backgroundColor: '#FDF2F2',
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },

  itemQuantity: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },

  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemExpiry: {
    fontSize: 14,
    color: '#666666',
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },

  // Floating button
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  floatingAddButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
  },

  // Quantity container with integrated unit selector
  quantityContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
    overflow: 'hidden',
  },

  quantityInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333333',
  },

  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#E9ECEF',
    borderLeftWidth: 1,
    borderLeftColor: '#DDD',
    minWidth: 80,
  },

  unitText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginRight: 5,
  },

  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
  },

  dateInput: {
    justifyContent: 'center',
    paddingVertical: 15,
  },

  dateInputText: {
    fontSize: 16,
    color: '#333333',
  },

  dateInputPlaceholder: {
    fontSize: 16,
    color: '#999999',
  },

  // Unit picker modal styles
  unitModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  unitModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 20,
    width: '80%',
    maxHeight: '60%',
  },

  unitModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },

  unitOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },

  selectedUnitOption: {
    backgroundColor: '#FF6B6B20',
  },

  unitOptionText: {
    fontSize: 16,
    color: '#333333',
  },

  selectedUnitOptionText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },

  unitModalCloseButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },

  unitModalCloseText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },

  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#F8F9FA',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },

  saveButton: {
    backgroundColor: '#FF6B6B',
    marginLeft: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;