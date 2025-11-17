import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../data/AuthContext';
import { supabase, withUserContext } from '../data/supabase';
import styles from './styles/cookingScreenStyles';

const CookingScreen = ({ navigation, route }) => {
  const { getUsername, getUserId } = useAuth();
  const preSelectedIngredient = route?.params?.ingredient; // From inventory "Cook" button
  
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' or 'custom'
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [selectedCustomIngredients, setSelectedCustomIngredients] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (selectedIngredient) {
      loadSuggestedRecipes(selectedIngredient);
    }
  }, [selectedIngredient]);

  const loadInventory = async () => {
    try {
      setIsLoadingInventory(true);
      const userId = getUserId();

      if (!userId) {
        console.warn('No user ID found');
        setIsLoadingInventory(false);
        return;
      }

      console.log('Loading inventory for user:', userId);

      // Load from Supabase inventory table - include 'unit' column
      const { data, error } = await withUserContext(userId, async () => {
        return await supabase
          .from('inventory')
          .select('item_id, user_id, item_name, quantity, unit, expiry_date, cost, created_at')
          .eq('user_id', userId)
          .order('expiry_date', { ascending: true });
      });

      if (error) {
        console.error('Error loading inventory:', error);
        throw error;
      }

      console.log('Loaded inventory items:', data?.length || 0);

      // Transform and calculate days left + status
      const formattedItems = data?.map(item => {
        const daysLeft = calculateDaysLeft(item.expiry_date);
        
        console.log('Inventory item raw data:', {
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit: item.unit,
          quantity_type: typeof item.quantity
        });
        
        // Combine quantity (int) and unit (varchar) into a string for display
        const quantityString = `${item.quantity} ${item.unit || ''}`.trim();
        
        return {
          id: item.item_id.toString(),
          name: item.item_name,
          quantity: quantityString, // e.g., "500 g" for display
          quantityValue: item.quantity, // Store raw integer for calculations
          unit: item.unit,
          expiryDate: item.expiry_date,
          cost: item.cost,
          daysLeft: daysLeft,
          status: getStatus(daysLeft),
          dbId: item.item_id
        };
      }) || [];

      console.log('Formatted inventory items:', formattedItems.length);
      if (formattedItems.length > 0) {
        console.log('Sample item:', formattedItems[0]);
      }

      setInventoryItems(formattedItems);

      // Auto-select ingredient (prioritize expiring items)
      if (preSelectedIngredient) {
        // If coming from inventory screen, use pre-selected
        setSelectedIngredient(preSelectedIngredient);
      } else if (formattedItems.length > 0) {
        // Otherwise, prioritize expiring items to reduce waste
        const expiringItems = formattedItems.filter(item => item.status === 'expiring');
        if (expiringItems.length > 0) {
          setSelectedIngredient(expiringItems[0].name);
        } else {
          setSelectedIngredient(formattedItems[0].name);
        }
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      Alert.alert('Error', 'Failed to load inventory items');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatus = (daysLeft) => {
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'expiring';
    return 'fresh';
  };

  const loadSuggestedRecipes = async (ingredientName) => {
    try {
      setIsLoadingRecipes(true);
      const userId = getUserId();

      console.log('Loading recipes for ingredient:', ingredientName);

      // Step 1: Find recipes that contain this ingredient
      // First, get all recipe_ingredients that match the ingredient name
      const { data: matchingIngredients, error: ingredientsError } = await withUserContext(userId, async () => {
        return await supabase
          .from('recipe_ingredients')
          .select('recipe_id, item_name, quantity_needed, unit')
          .ilike('item_name', `%${ingredientName}%`);
      });

      if (ingredientsError) {
        console.error('Error loading recipe ingredients:', ingredientsError);
        throw ingredientsError;
      }

      console.log('Found recipe ingredients:', matchingIngredients?.length || 0);

      if (!matchingIngredients || matchingIngredients.length === 0) {
        setSuggestedRecipes([]);
        setIsLoadingRecipes(false);
        return;
      }

      // Get unique recipe IDs
      const recipeIds = [...new Set(matchingIngredients.map(ing => ing.recipe_id))];

      // Step 2: Load full recipe details for these IDs
      const { data: recipes, error: recipesError } = await withUserContext(userId, async () => {
        return await supabase
          .from('recipes')
          .select('recipe_id, user_id, title, description, instructions, created_at')
          .in('recipe_id', recipeIds);
      });

      if (recipesError) {
        console.error('Error loading recipes:', recipesError);
        throw recipesError;
      }

      console.log('Found recipes:', recipes?.length || 0);

      // Step 3: For each recipe, get ALL its ingredients and check availability
      const recipesWithDetails = await Promise.all(
        (recipes || []).map(async (recipe) => {
          try {
            // Get all ingredients for this recipe
            const { data: allIngredients, error: allIngredientsError } = await supabase
              .from('recipe_ingredients')
              .select('ingredient_id, recipe_id, item_name, quantity_needed, unit')
              .eq('recipe_id', recipe.recipe_id);

            if (allIngredientsError) {
              console.error('Error loading ingredients for recipe:', recipe.recipe_id);
              console.error('Error code:', allIngredientsError.code);
              console.error('Error message:', allIngredientsError.message);
              return {
                ...recipe,
                ingredients: [],
                missingCount: 0,
                missingIngredients: [],
                availableCount: 0,
                matchPercentage: 0,
                hasError: true
              };
            }

            // Check if no ingredients found
            if (!allIngredients || allIngredients.length === 0) {
              console.warn('No ingredients found for recipe:', recipe.recipe_id, recipe.title);
              return {
                ...recipe,
                ingredients: [],
                missingCount: 0,
                missingIngredients: [],
                availableCount: 0,
                matchPercentage: 0
              };
            }

            console.log(`Recipe "${recipe.title}" has ${allIngredients.length} ingredients`);

            // Check which ingredients user has in inventory
            const inventoryNames = inventoryItems.map(item => item.name.toLowerCase());
            
            const availableIngredients = [];
            const missingIngredients = [];

            (allIngredients || []).forEach(ingredient => {
              const isAvailable = inventoryNames.includes(ingredient.item_name.toLowerCase());
              
              if (isAvailable) {
                availableIngredients.push(ingredient);
              } else {
                missingIngredients.push(ingredient);
              }
            });

            // Calculate match percentage
            const totalIngredients = allIngredients?.length || 0;
            const matchPercentage = totalIngredients > 0 
              ? Math.round((availableIngredients.length / totalIngredients) * 100)
              : 0;

            return {
              recipe_id: recipe.recipe_id,
              user_id: recipe.user_id,
              title: recipe.title,
              description: recipe.description,
              instructions: recipe.instructions,
              created_at: recipe.created_at,
              ingredients: allIngredients || [],
              availableIngredients: availableIngredients,
              missingIngredients: missingIngredients,
              missingCount: missingIngredients.length,
              availableCount: availableIngredients.length,
              matchPercentage: matchPercentage
            };
          } catch (error) {
            console.error('Unexpected error processing recipe:', recipe.recipe_id, error);
            return {
              ...recipe,
              ingredients: [],
              missingCount: 0,
              missingIngredients: [],
              availableCount: 0,
              matchPercentage: 0,
              hasError: true
            };
          }
        })
      );

      // Step 4: Sort by best match (most available ingredients, least missing)
      recipesWithDetails.sort((a, b) => {
        // First priority: Perfect matches (100%)
        if (a.matchPercentage === 100 && b.matchPercentage !== 100) return -1;
        if (b.matchPercentage === 100 && a.matchPercentage !== 100) return 1;
        
        // Second priority: Highest match percentage
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        
        // Third priority: Fewest missing ingredients
        return a.missingCount - b.missingCount;
      });

      console.log('Processed recipes with details:', recipesWithDetails.length);

      setSuggestedRecipes(recipesWithDetails);
    } catch (error) {
      console.error('Error loading recipes:', error);
      Alert.alert('Error', 'Failed to load recipe suggestions');
      setSuggestedRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const handleCookRecipe = (recipe) => {
    Alert.alert(
      'Cook Recipe',
      `Would you like to cook "${recipe.title}"?\n\nThis will use ${recipe.availableCount} ingredient(s) from your inventory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Recipe',
          onPress: () => {
            Alert.alert(
              recipe.title,
              recipe.instructions || 'No instructions available for this recipe.',
              [{ text: 'OK' }]
            );
          }
        },
        {
          text: 'Start Cooking',
          onPress: async () => {
            await logRecipeUsage(recipe);
          }
        }
      ]
    );
  };

  const logRecipeUsage = async (recipe) => {
    try {
      const userId = getUserId();
      let updatedCount = 0;
      let deletedCount = 0;

      console.log('Starting recipe usage logging for:', recipe.title);
      console.log('Available ingredients to process:', recipe.availableIngredients.length);

      // Process each AVAILABLE ingredient (only those in inventory)
      for (const ingredient of recipe.availableIngredients) {
        console.log('Processing ingredient:', ingredient.item_name);
        
        const inventoryItem = inventoryItems.find(
          item => item.name.toLowerCase() === ingredient.item_name.toLowerCase()
        );

        if (!inventoryItem) {
          console.warn('Inventory item not found for:', ingredient.item_name);
          continue;
        }

        console.log('Found inventory item:', inventoryItem);

        try {
          // Use the raw numeric quantity value from database
          const currentQty = inventoryItem.quantityValue; // This is the int4 from DB
          const currentUnit = inventoryItem.unit;
          const neededQty = parseFloat(ingredient.quantity_needed);

          if (typeof currentQty !== 'number' || isNaN(neededQty)) {
            console.error('Invalid quantity values:', { currentQty, neededQty });
            continue;
          }

          console.log(`Current: ${currentQty} ${currentUnit}, Needed: ${neededQty} ${ingredient.unit}`);

          // Calculate new quantity
          const newQty = currentQty - neededQty;

          // Log usage to usage_logs table (store as int4)
          await withUserContext(userId, async () => {
            return await supabase.from('usage_logs').insert({
              user_id: userId,
              item_id: inventoryItem.dbId,
              action_type: 'cooked',
              quantity: currentQty, // Store as integer
              action_date: new Date().toISOString(),
              notes: `Used ${ingredient.quantity_needed} ${ingredient.unit} in recipe: ${recipe.title}`
            });
          });

          console.log('Usage logged successfully');

          if (newQty <= 0) {
            // Delete from inventory if quantity reaches 0 or below
            console.log('Deleting item (quantity exhausted):', inventoryItem.name);
            await withUserContext(userId, async () => {
              return await supabase
                .from('inventory')
                .delete()
                .eq('item_id', inventoryItem.dbId);
            });
            deletedCount++;
          } else {
            // Update quantity in inventory (store as integer)
            console.log('Updating item quantity to:', newQty);
            await withUserContext(userId, async () => {
              return await supabase
                .from('inventory')
                .update({ 
                  quantity: Math.floor(newQty) // Ensure it's an integer
                })
                .eq('item_id', inventoryItem.dbId);
            });
            updatedCount++;
          }
        } catch (itemError) {
          console.error('Error processing item:', inventoryItem.name, itemError);
          continue;
        }
      }

      // Reload inventory to show updated quantities
      await loadInventory();
      
      Alert.alert(
        'Success! 🍳',
        `Recipe logged successfully!\n\n• ${updatedCount} item(s) updated\n• ${deletedCount} item(s) removed (used up)\n\nEnjoy your meal!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error logging recipe usage:', error);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', `Failed to log recipe usage: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return '#DC3545';
      case 'expiring': return '#FFC107';
      case 'fresh': return '#28A745';
      default: return '#718096';
    }
  };

  const getStatusLabel = (daysLeft) => {
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return '1 day left';
    if (daysLeft <= 3) return `${daysLeft} days left`;
    return `${daysLeft} days left`;
  };

  const toggleCustomIngredient = (item) => {
    const isSelected = selectedCustomIngredients.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedCustomIngredients(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSelectedCustomIngredients(prev => [...prev, item]);
    }
  };

  const handleStartCustomCooking = async () => {
    if (selectedCustomIngredients.length === 0) {
      Alert.alert('Error', 'Please select at least one ingredient');
      return;
    }

    Alert.alert(
      'Start Cooking',
      `Cook with ${selectedCustomIngredients.length} ingredient(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              const userId = getUserId();

              // Log each ingredient usage to usage_logs
              for (const item of selectedCustomIngredients) {
                await withUserContext(userId, async () => {
                  return await supabase.from('usage_logs').insert({
                    user_id: userId,
                    item_id: item.dbId,
                    action_type: 'cooked',
                    quantity: item.quantityValue, // Use integer quantity
                    action_date: new Date().toISOString(),
                    notes: 'Custom recipe cooking'
                  });
                });

                // Delete from inventory (assuming full usage for custom recipe)
                await withUserContext(userId, async () => {
                  return await supabase
                    .from('inventory')
                    .delete()
                    .eq('item_id', item.dbId);
                });
              }

              // Reload inventory
              await loadInventory();
              setSelectedCustomIngredients([]);
              
              Alert.alert('Success! 🍳', 'Custom cooking logged successfully!');
            } catch (error) {
              console.error('Error logging custom cooking:', error);
              Alert.alert('Error', 'Failed to log cooking');
            }
          }
        }
      ]
    );
  };

  const filteredInventory = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIngredientItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.ingredientCard,
        selectedIngredient === item.name && styles.selectedIngredientCard
      ]}
      onPress={() => {
        setSelectedIngredient(item.name);
        setShowIngredientSelector(false);
      }}
    >
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <View style={styles.ingredientMeta}>
          <Text style={styles.ingredientQuantity}>📦 {item.quantity}</Text>
          <View style={[styles.expiryBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.expiryText}>{getStatusLabel(item.daysLeft)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecipeCard = ({ item }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description || 'A delicious recipe to try!'}
          </Text>
        </View>
        {item.matchPercentage === 100 && (
          <View style={styles.perfectMatchBadge}>
            <Text style={styles.perfectMatchText}>✓ 100% Match</Text>
          </View>
        )}
        {item.matchPercentage < 100 && item.matchPercentage >= 50 && (
          <View style={[styles.perfectMatchBadge, { backgroundColor: '#FFC107' }]}>
            <Text style={styles.perfectMatchText}>{item.matchPercentage}% Match</Text>
          </View>
        )}
      </View>

      <View style={styles.ingredientsList}>
        <Text style={styles.ingredientsTitle}>
          Ingredients ({item.ingredients.length})
        </Text>
        {item.ingredients.slice(0, 4).map((ingredient, index) => {
          const isAvailable = item.availableIngredients.some(
            avail => avail.item_name === ingredient.item_name
          );
          return (
            <Text 
              key={index} 
              style={[
                styles.ingredientItem,
                isAvailable && { color: '#28A745', fontWeight: '600' }
              ]}
            >
              {isAvailable ? '✓' : '○'} {ingredient.item_name} - {ingredient.quantity_needed} {ingredient.unit}
            </Text>
          );
        })}
        {item.ingredients.length > 4 && (
          <Text style={styles.moreIngredients}>
            +{item.ingredients.length - 4} more ingredients
          </Text>
        )}
      </View>

      {item.missingCount > 0 && (
        <View style={styles.missingInfo}>
          <Text style={styles.missingText}>
            🛒 Missing {item.missingCount} ingredient{item.missingCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {item.availableCount > 0 && (
        <View style={styles.availableInfo}>
          <Text style={styles.availableText}>
            ✓ You have {item.availableCount}/{item.ingredients.length} ingredients
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.cookButton}
        onPress={() => handleCookRecipe(item)}
      >
        <Text style={styles.cookButtonIcon}>👨‍🍳</Text>
        <Text style={styles.cookButtonText}>Cook This</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoadingInventory) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#718096' }}>
          Loading inventory...
        </Text>
      </View>
    );
  }

  const selectedItem = inventoryItems.find(i => i.name === selectedIngredient);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.modernHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.modernHeaderTitle}>Cook Something</Text>
            <Text style={styles.modernHeaderSubtitle}>
              Hi {getUsername()}! Let's reduce waste 🍳
            </Text>
          </View>
          <View style={{ width: 60 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
            onPress={() => setActiveTab('suggestions')}
          >
            <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
              🔍 Recipe Suggestions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
            onPress={() => setActiveTab('custom')}
          >
            <Text style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>
              ✏️ My Own Recipe
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {activeTab === 'suggestions' ? (
          <>
            {/* Selected Ingredient Section */}
            <View style={styles.selectedSection}>
              <Text style={styles.sectionLabel}>Cooking with:</Text>
              <TouchableOpacity
                style={styles.selectedIngredientButton}
                onPress={() => setShowIngredientSelector(!showIngredientSelector)}
              >
                <Text style={styles.selectedIngredientText}>
                  {selectedIngredient || 'Select an ingredient'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              
              {selectedIngredient && selectedItem && (
                <View style={styles.ingredientDetailCard}>
                  <Text style={styles.ingredientDetailText}>
                    📦 {selectedItem.quantity}
                  </Text>
                  <Text style={[
                    styles.ingredientDetailText,
                    { color: getStatusColor(selectedItem.status) }
                  ]}>
                    ⏰ {getStatusLabel(selectedItem.daysLeft)}
                  </Text>
                  {selectedItem.cost && (
                    <Text style={styles.ingredientDetailText}>
                      💰 ₱{parseFloat(selectedItem.cost).toFixed(2)}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Ingredient Selector Dropdown */}
            {showIngredientSelector && (
              <View style={styles.ingredientSelectorContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search ingredients..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                />
                <FlatList
                  data={filteredInventory}
                  renderItem={renderIngredientItem}
                  keyExtractor={(item) => item.id}
                  style={styles.ingredientList}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No ingredients found</Text>
                  }
                />
              </View>
            )}

            {/* Recipe Suggestions */}
            <View style={styles.recipesSection}>
              <Text style={styles.sectionTitle}>
                Suggested Recipes ({suggestedRecipes.length})
              </Text>

              {isLoadingRecipes ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4ECDC4" />
                  <Text style={styles.loadingText}>Finding recipes...</Text>
                </View>
              ) : suggestedRecipes.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🍳</Text>
                  <Text style={styles.emptyText}>No recipes found</Text>
                  <Text style={styles.emptySubText}>
                    Try selecting a different ingredient or add recipes to the database
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={suggestedRecipes}
                  renderItem={renderRecipeCard}
                  keyExtractor={(item) => item.recipe_id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.recipesList}
                />
              )}
            </View>
          </>
        ) : (
          // Custom Recipe Tab
          <ScrollView style={styles.customRecipeContainer}>
            <Text style={styles.customTitle}>Create Your Own Recipe</Text>
            <Text style={styles.customSubtitle}>
              Select ingredients from your inventory to create a custom meal
            </Text>

            <View style={styles.customIngredientsSection}>
              <Text style={styles.sectionLabel}>
                Selected: {selectedCustomIngredients.length} item(s)
              </Text>
              
              {inventoryItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📦</Text>
                  <Text style={styles.emptyText}>No items in inventory</Text>
                </View>
              ) : (
                <FlatList
                  data={inventoryItems}
                  renderItem={({ item }) => {
                    const isSelected = selectedCustomIngredients.find(i => i.id === item.id);
                    return (
                      <TouchableOpacity 
                        style={[
                          styles.customIngredientCard,
                          isSelected && styles.selectedCustomIngredient
                        ]}
                        onPress={() => toggleCustomIngredient(item)}
                      >
                        <View style={styles.ingredientInfo}>
                          <Text style={styles.ingredientName}>{item.name}</Text>
                          <View style={styles.ingredientMeta}>
                            <Text style={styles.ingredientQuantity}>📦 {item.quantity}</Text>
                            <View style={[styles.expiryBadge, { backgroundColor: getStatusColor(item.status) }]}>
                              <Text style={styles.expiryText}>{getStatusLabel(item.daysLeft)}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[
                          styles.addButton,
                          isSelected && styles.selectedButton
                        ]}>
                          <Text style={styles.addButtonText}>
                            {isSelected ? '✓' : '+'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              )}
            </View>

            {selectedCustomIngredients.length > 0 && (
              <TouchableOpacity 
                style={styles.startCookingButton}
                onPress={handleStartCustomCooking}
              >
                <Text style={styles.startCookingText}>
                  Start Cooking ({selectedCustomIngredients.length} items)
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default CookingScreen;