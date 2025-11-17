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

  backButton: {
    padding: 8,
  },

  backButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
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

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#4ECDC4',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  // Content Container
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },

  // Selected Ingredient Section
  selectedSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },

  selectedIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  selectedIngredientText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },

  dropdownIcon: {
    fontSize: 12,
    color: '#718096',
  },

  ingredientDetailCard: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },

  ingredientDetailText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },

  // Ingredient Selector
  ingredientSelectorContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  searchInput: {
    padding: 16,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    color: '#1A202C',
  },

  ingredientList: {
    maxHeight: 250,
  },

  ingredientCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },

  selectedIngredientCard: {
    backgroundColor: '#E6FFFA',
  },

  ingredientInfo: {
    flex: 1,
  },

  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 6,
  },

  ingredientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  ingredientQuantity: {
    fontSize: 14,
    color: '#718096',
  },

  expiryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  expiryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Recipes Section
  recipesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },

  recipesList: {
    paddingBottom: 20,
  },

  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },

  recipeDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },

  perfectMatchBadge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  perfectMatchText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  ingredientsList: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },

  ingredientItem: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
    lineHeight: 18,
  },

  moreIngredients: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '600',
    marginTop: 4,
  },

  missingInfo: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FC8181',
  },

  missingText: {
    fontSize: 13,
    color: '#C53030',
    fontWeight: '600',
  },

  availableInfo: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#48BB78',
  },

  availableText: {
    fontSize: 13,
    color: '#22543D',
    fontWeight: '600',
  },

  cookButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  cookButtonIcon: {
    fontSize: 18,
  },

  cookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
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
    textAlign: 'center',
  },

  // Custom Recipe Tab
  customRecipeContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  customTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },

  customSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 24,
    lineHeight: 20,
  },

  customIngredientsSection: {
    marginBottom: 24,
  },

  customIngredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedCustomIngredient: {
    borderColor: '#4ECDC4',
    backgroundColor: '#E6FFFA',
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedButton: {
    backgroundColor: '#48BB78',
  },

  addButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  startCookingButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  startCookingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default styles;