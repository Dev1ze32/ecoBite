import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, StatusBar } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/inventoryStyles.js';

const InventoryScreen = ({ navigation, onBack }) => { 
  // Handle navigation to home
  const handleGoToHome = () => {
    if (onBack) {
      onBack(); // Use onBack prop like in donation screen
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Home'); // Fallback to navigation
    } else if (navigation && navigation.goBack) {
      navigation.goBack(); // Final fallback
    }
  };

  const [inventoryList, setInventoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  // Calendar picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Unit picker states
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs'); // Default to pieces
  const units = [
    { label: "Pieces", value: "pcs" },
    { label: "Kilogram", value: "kg" },
    { label: "Gram", value: "g" },
    { label: "Liter", value: "l" },
    { label: "Milliliter", value: "ml" },
    { label: "Pounds", value: "lbs" },
  ];

  // Function to determine if item is expired or expiring soon
  const getItemStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'expired'; // Red
    } else if (diffDays <= 3) {
      return 'expiring'; // Orange
    } else {
      return 'fresh'; // Normal
    }
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setExpiryDate(formattedDate);
    }
  };

  // Function to open date picker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // Function to add item to inventory
  const addItem = () => {
    if (!itemName.trim() || !quantity.trim() || !expiryDate.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: `${quantity.trim()} ${selectedUnit}`,
      expiryDate: expiryDate.trim(),
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setInventoryList([...inventoryList, newItem]);
    setItemName('');
    setQuantity('');
    setExpiryDate('');
    setModalVisible(false);
  };

  // Function to delete item from inventory
  const deleteItem = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setInventoryList(inventoryList.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  // Function to render each inventory item
  const renderItem = ({ item }) => {
    const status = getItemStatus(item.expiryDate);
    const itemStyle = status === 'expired' 
      ? styles.expiredItem 
      : status === 'expiring' 
      ? styles.expiringItem 
      : styles.freshItem;

    return (
      <TouchableOpacity 
        style={[styles.itemContainer, itemStyle]}
        onLongPress={() => deleteItem(item.id)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemExpiry}>
            Expires: {item.expiryDate}
          </Text>
          {status === 'expired' && (
            <Text style={styles.statusText}>EXPIRED</Text>
          )}
          {status === 'expiring' && (
            <Text style={styles.statusText}>EXPIRING SOON</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Function to render alerts section
  const renderAlerts = () => {
    const expiringItems = inventoryList.filter(item => 
      getItemStatus(item.expiryDate) === 'expiring'
    );
    const expiredItems = inventoryList.filter(item => 
      getItemStatus(item.expiryDate) === 'expired'
    );

    if (expiringItems.length === 0 && expiredItems.length === 0) {
      return null;
    }

    return (
      <View style={styles.alertsContainer}>
        <Text style={styles.alertsTitle}>Soon to Expire Alerts</Text>
        {expiredItems.length > 0 && (
          <Text style={styles.expiredAlert}>
            {expiredItems.length} item(s) expired
          </Text>
        )}
        {expiringItems.length > 0 && (
          <Text style={styles.expiringAlert}>
            {expiringItems.length} item(s) expiring soon
          </Text>
        )}
      </View>
    );
  };

  // Get current unit label
  const getCurrentUnitLabel = () => {
    const unit = units.find(u => u.value === selectedUnit);
    return unit ? unit.label : 'Unit';
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSubtitle}>Manage your food items and track expiry dates</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoToHome}>
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts Section */}
      {renderAlerts()}

      {/* Inventory List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Inventory List</Text>
        {inventoryList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in inventory</Text>
            <Text style={styles.emptySubText}>Tap the + button to get started</Text>
          </View>
        ) : (
          <FlatList
            data={inventoryList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
            />
            
            {/* Quantity Input with Unit Selector */}
            <View style={styles.quantityContainer}>
              <TextInput
                style={styles.quantityInput}
                placeholder="Quantity (e.g., 2, 1.5)"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.unitSelector}
                onPress={() => setShowUnitPicker(true)}
              >
                <Text style={styles.unitText}>{selectedUnit}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
            
            {/* Date Input with Calendar Picker */}
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={openDatePicker}
            >
              <Text style={expiryDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                {expiryDate || 'Select Expiry Date'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setItemName('');
                  setQuantity('');
                  setExpiryDate('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
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