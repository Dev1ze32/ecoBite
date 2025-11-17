import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Modern Header
  modernHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
  },

  modernHeaderSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },

  modernHomeButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  modernHomeButtonText: {
    fontSize: 20,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  statCardActive: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E6FFFA',
  },

  warningCard: {
    backgroundColor: '#FFFAF0',
  },

  dangerCard: {
    backgroundColor: '#FFF5F5',
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
  },

  statLabel: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },

  // List Container
  listContainer: {
    flex: 1,
    paddingTop: 16,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },

  clearFilterText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },

  swipeHint: {
    backgroundColor: '#EDF2F7',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },

  swipeHintText: {
    fontSize: 13,
    color: '#4A5568',
    textAlign: 'center',
  },

  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },

  emptySubText: {
    fontSize: 14,
    color: '#A0AEC0',
  },

  // Swipeable Item
  swipeContainer: {
    marginBottom: 12,
    position: 'relative',
  },

  actionsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftAction: {
    backgroundColor: '#48BB78',
    width: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightAction: {
    backgroundColor: '#F56565',
    width: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },

  actionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },

  // Item Card
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  itemInfo: {
    marginBottom: 12,
    paddingRight: 100,
  },

  itemNameModern: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 6,
  },

  itemMeta: {
    flexDirection: 'row',
    gap: 16,
  },

  metaText: {
    fontSize: 13,
    color: '#718096',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  wasteButton: {
    backgroundColor: '#FED7D7',
  },

  actionButtonIcon: {
    fontSize: 16,
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },

  // Floating Button
  modernFloatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  floatingAddButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modernModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },

  modernModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Input Styles
  modernInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F7FAFC',
    marginBottom: 16,
    color: '#1A202C',
  },

  quantityContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    marginBottom: 16,
    overflow: 'hidden',
  },

  quantityInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
  },

  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#EDF2F7',
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    minWidth: 80,
  },

  unitText: {
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '600',
    marginRight: 6,
  },

  dropdownArrow: {
    fontSize: 10,
    color: '#718096',
  },

  modernDateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F7FAFC',
    marginBottom: 16,
  },

  dateInputIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  dateInputText: {
    fontSize: 16,
    color: '#1A202C',
    flex: 1,
  },

  dateInputPlaceholder: {
    fontSize: 16,
    color: '#A0AEC0',
    flex: 1,
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  modernModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#EDF2F7',
  },

  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Unit Picker Modal
  unitModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  unitModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },

  unitModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  unitOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },

  selectedUnitOption: {
    backgroundColor: '#E6FFFA',
  },

  unitOptionText: {
    fontSize: 16,
    color: '#4A5568',
  },

  selectedUnitOptionText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },

  unitModalCloseButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  unitModalCloseText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '600',
  },
});

export default styles;