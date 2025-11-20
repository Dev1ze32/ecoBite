import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, Animated, PanResponder, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/inventoryStyles.js';
import { useAuth } from '../data/AuthContext';
import { supabase, withUserContext } from '../data/supabase';

// Swipeable Item Component
const SwipeableItem = ({ item, onCook, onMarkUsed, onWaste }) => {
  const translateX = new Animated.Value(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dx) > 10;
    },
    onPanResponderGrant: () => {
      setIsSwiping(true);
    },
    onPanResponderMove: (_, gesture) => {
      const maxSwipe = 150;
      const minSwipe = -150;
      const clampedValue = Math.max(minSwipe, Math.min(maxSwipe, gesture.dx));
      translateX.setValue(clampedValue);
    },
    onPanResponderRelease: (_, gesture) => {
      setIsSwiping(false);
      
      if (gesture.dx > 80) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        onMarkUsed(item);
      } else if (gesture.dx < -80) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        onWaste(item);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const status = getItemStatus(item.expiry_date);
  const statusConfig = {
    expired: { color: '#DC3545', label: 'EXPIRED', icon: '🔴' },
    expiring: { color: '#FFC107', label: 'EXPIRING SOON', icon: '🟡' },
    fresh: { color: '#28A745', label: 'FRESH', icon: '🟢' },
  };

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.actionsBackground}>
        <View style={styles.leftAction}>
          <Text style={styles.actionIcon}>✓</Text>
          <Text style={styles.actionText}>Used</Text>
        </View>
        <View style={styles.rightAction}>
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={styles.actionText}>Waste</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.itemCard,
          {
            transform: [{ translateX }],
            borderLeftColor: statusConfig[status].color,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.statusBadge, { backgroundColor: statusConfig[status].color }]}>
          <Text style={styles.statusBadgeText}>
            {statusConfig[status].icon} {statusConfig[status].label}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemNameModern}>{item.item_name}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.metaText}>📦 {item.quantity} {item.unit || ''}</Text>
            <Text style={styles.metaText}>📅 {item.expiry_date}</Text>
            {item.cost && <Text style={styles.metaText}>💰 ₱{item.cost}</Text>}
          </View>
        </View>

        <View style={styles.quickActions} pointerEvents={isSwiping ? 'none' : 'auto'}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onCook(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>👨‍🍳</Text>
            <Text style={styles.actionButtonText}>Cook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onMarkUsed(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>✓</Text>
            <Text style={styles.actionButtonText}>Used</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.wasteButton]}
            onPress={() => onWaste(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🗑️</Text>
            <Text style={styles.actionButtonText}>Waste</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// Helper function
const getItemStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring';
  return 'fresh';
};

const InventoryScreen = ({ navigation, onBack }) => {
  const { getUsername, getUserId } = useAuth();
  const userId = getUserId();
  
  const handleGoToHome = () => {
    if (onBack) {
      onBack();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Home');
    } else if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [viewMode, setViewMode] = useState('all');

  const units = [
    { label: "Pieces", value: "pcs" },
    { label: "Kilogram", value: "kg" },
    { label: "Gram", value: "g" },
    { label: "Liter", value: "l" },
    { label: "Milliliter", value: "ml" },
    { label: "Pounds", value: "lbs" },
  ];

  // Fetch inventory items from Supabase
  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        console.log('No userId available');
        setLoading(false);
        return;
      }

      console.log('Fetching inventory for user:', userId);

      // Use withUserContext to ensure RLS context is set
      const { data, error } = await withUserContext(userId, async () => {
        return await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched inventory items:', data?.length || 0);
      setInventoryList(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      Alert.alert('Error', 'Failed to load inventory items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load inventory on mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchInventory();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setExpiryDate(formattedDate);
    }
  };

  const addItem = async () => {
    if (!itemName.trim() || !quantity.trim() || !expiryDate.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const newItem = {
        user_id: userId,
        item_name: itemName.trim(),
        quantity: parseInt(quantity.trim()),
        unit: selectedUnit,
        expiry_date: expiryDate.trim(),
        cost: cost.trim() ? parseFloat(cost.trim()) : null,
      };

      console.log('Adding item:', newItem);

      const { data, error } = await withUserContext(userId, async () => {
        return await supabase
          .from('inventory')
          .insert([newItem])
          .select();
      });

      if (error) {
        console.error('Error adding item:', error);
        throw error;
      }

      console.log('Item added successfully:', data);

      // Add to local state
      if (data && data.length > 0) {
        setInventoryList([data[0], ...inventoryList]);
      }

      // Reset form
      setItemName('');
      setQuantity('');
      setCost('');
      setExpiryDate('');
      setSelectedUnit('pcs');
      setModalVisible(false);
      
      Alert.alert('Success', 'Item added to inventory! 🎉');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item to inventory. Please try again.');
    }
  };

  const updateItemQuantity = async (item, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await deleteItem(item.item_id);
        return;
      }

      const { error } = await withUserContext(userId, async () => {
        return await supabase
          .from('inventory')
          .update({ quantity: newQuantity })
          .eq('item_id', item.item_id)
          .eq('user_id', userId); // Extra security
      });

      if (error) {
        console.error('Error updating quantity:', error);
        throw error;
      }

      // Update local state
      setInventoryList(inventoryList.map(i => 
        i.item_id === item.item_id 
          ? { ...i, quantity: newQuantity }
          : i
      ));

      Alert.alert('Updated', `${item.item_name} quantity updated!`);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const { error } = await withUserContext(userId, async () => {
        return await supabase
          .from('inventory')
          .delete()
          .eq('item_id', itemId)
          .eq('user_id', userId); // Extra security
      });

      if (error) {
        console.error('Error deleting item:', error);
        throw error;
      }

      // Update local state
      setInventoryList(inventoryList.filter(i => i.item_id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleCook = (item) => {
    Alert.alert(
      'Cook with ' + item.item_name,
      'Navigate to recipe suggestions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Find Recipes', 
          onPress: () => {
            if (navigation && navigation.navigate) {
              navigation.navigate('SmartMealPlan', { ingredient: item.item_name });
            } else {
              Alert.alert('Feature Coming Soon', 'Recipe suggestions will be here!');
            }
          }
        },
      ]
    );
  };

  const handleMarkUsed = (item) => {
    Alert.alert(
      'Mark as Used',
      `Update quantity for ${item.item_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reduce by Half',
          onPress: async () => {
            const newQty = Math.floor(item.quantity / 2);
            await updateItemQuantity(item, newQty);
          }
        },
        {
          text: 'Remove Completely',
          onPress: async () => {
            await deleteItem(item.item_id);
            Alert.alert('Removed', `${item.item_name} marked as fully used! ✓`);
          },
          style: 'destructive'
        },
      ]
    );
  };

  const handleWaste = (item) => {
    Alert.alert(
      '🗑️ Mark as Waste',
      `Record ${item.item_name} as food waste?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Wasted',
          onPress: async () => {
            // TODO: Add to waste_tracking table for analytics
            await deleteItem(item.item_id);
            Alert.alert(
              'Recorded',
              `${item.item_name} marked as waste. This will help improve future suggestions.`,
              [{ text: 'OK' }]
            );
          },
          style: 'destructive'
        },
      ]
    );
  };

  // Filter items based on view mode
  const getFilteredItems = () => {
    if (viewMode === 'all') return inventoryList;
    return inventoryList.filter(item => getItemStatus(item.expiry_date) === viewMode);
  };

  // Calculate statistics
  const getStats = () => {
    const fresh = inventoryList.filter(i => getItemStatus(i.expiry_date) === 'fresh').length;
    const expiring = inventoryList.filter(i => getItemStatus(i.expiry_date) === 'expiring').length;
    const expired = inventoryList.filter(i => getItemStatus(i.expiry_date) === 'expired').length;
    return { fresh, expiring, expired, total: inventoryList.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={{ marginTop: 16, color: '#718096' }}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.modernHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.modernHeaderTitle}>Inventory</Text>
            <Text style={styles.modernHeaderSubtitle}>
              Hi {getUsername()}! Track your food 🍎
            </Text>
          </View>
          <TouchableOpacity style={styles.modernHomeButton} onPress={handleGoToHome}>
            <Text style={styles.modernHomeButtonText}>🏠</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, viewMode === 'fresh' && styles.statCardActive]}
            onPress={() => setViewMode(viewMode === 'fresh' ? 'all' : 'fresh')}
          >
            <Text style={styles.statIcon}>🟢</Text>
            <Text style={styles.statNumber}>{stats.fresh}</Text>
            <Text style={styles.statLabel}>Fresh</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.warningCard, viewMode === 'expiring' && styles.statCardActive]}
            onPress={() => setViewMode(viewMode === 'expiring' ? 'all' : 'expiring')}
          >
            <Text style={styles.statIcon}>🟡</Text>
            <Text style={styles.statNumber}>{stats.expiring}</Text>
            <Text style={styles.statLabel}>Expiring</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.dangerCard, viewMode === 'expired' && styles.statCardActive]}
            onPress={() => setViewMode(viewMode === 'expired' ? 'all' : 'expired')}
          >
            <Text style={styles.statIcon}>🔴</Text>
            <Text style={styles.statNumber}>{stats.expired}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {viewMode === 'all' ? 'All Items' : 
             viewMode === 'fresh' ? 'Fresh Items' :
             viewMode === 'expiring' ? 'Expiring Soon' :
             'Expired Items'} ({getFilteredItems().length})
          </Text>
          {viewMode !== 'all' && (
            <TouchableOpacity onPress={() => setViewMode('all')}>
              <Text style={styles.clearFilterText}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Swipe Hint */}
        {inventoryList.length > 0 && (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>
              💡 Swipe right to mark as used, left to waste
            </Text>
          </View>
        )}

        {getFilteredItems().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {viewMode === 'all' ? '📦' : 
               viewMode === 'fresh' ? '🟢' :
               viewMode === 'expiring' ? '🟡' : '🔴'}
            </Text>
            <Text style={styles.emptyText}>
              {viewMode === 'all' ? 'No items in inventory' :
               viewMode === 'fresh' ? 'No fresh items' :
               viewMode === 'expiring' ? 'No items expiring soon' :
               'No expired items'}
            </Text>
            <Text style={styles.emptySubText}>
              {viewMode === 'all' ? 'Tap the + button to get started' : 'Try a different filter'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={getFilteredItems()}
            renderItem={({ item }) => (
              <SwipeableItem
                item={item}
                onCook={handleCook}
                onMarkUsed={handleMarkUsed}
                onWaste={handleWaste}
              />
            )}
            keyExtractor={(item) => item.item_id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.modernFloatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingAddButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modernModalContainer}>
            <Text style={styles.modernModalTitle}>Add New Item</Text>
            
            <TextInput
              style={styles.modernInput}
              placeholder="Item Name (e.g., Tomatoes)"
              value={itemName}
              onChangeText={setItemName}
              placeholderTextColor="#999"
            />
            
            <View style={styles.quantityContainer}>
              <TextInput
                style={styles.quantityInput}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.unitSelector}
                onPress={() => setShowUnitPicker(true)}
              >
                <Text style={styles.unitText}>{selectedUnit}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modernInput}
              placeholder="Cost (Optional, e.g., 50)"
              value={cost}
              onChangeText={setCost}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity
              style={styles.modernDateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateInputIcon}>📅</Text>
              <Text style={expiryDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                {expiryDate || 'Select Expiry Date'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modernModalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setItemName('');
                  setQuantity('');
                  setCost('');
                  setExpiryDate('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modernModalButton, styles.saveButton]}
                onPress={addItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Unit Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUnitPicker}
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.unitModalOverlay}>
          <View style={styles.unitModalContainer}>
            <Text style={styles.unitModalTitle}>Select Unit</Text>
            <FlatList
              data={units}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    selectedUnit === item.value && styles.selectedUnitOption
                  ]}
                  onPress={() => {
                    setSelectedUnit(item.value);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={[
                    styles.unitOptionText,
                    selectedUnit === item.value && styles.selectedUnitOptionText
                  ]}>
                    {item.label} ({item.value})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.unitModalCloseButton}
              onPress={() => setShowUnitPicker(false)}
            >
              <Text style={styles.unitModalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default InventoryScreen;