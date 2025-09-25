import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

const CartScreen = ({ navigation }) => {
  const [lists, setLists] = useState([
    {
      id: '1',
      title: 'Weekly Groceries',
      description: '• Vegetables\n• Fruits\n• Dairy products\n• Meat',
      important: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Pantry Essentials',
      description: '• Rice\n• Cooking oil\n• Salt\n• Sugar\n• Spices',
      important: false,
      createdAt: new Date('2024-01-10')
    }
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListImportant, setNewListImportant] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const openAddModal = () => {
    setNewListTitle('');
    setNewListDescription('');
    setNewListImportant(false);
    setEditingList(null);
    setModalVisible(true);
  };

  const openEditModal = (list) => {
    setNewListTitle(list.title);
    setNewListDescription(list.description);
    setNewListImportant(list.important);
    setEditingList(list);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewListTitle('');
    setNewListDescription('');
    setNewListImportant(false);
    setEditingList(null);
  };

  const saveList = () => {
    if (!newListTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your list');
      return;
    }

    if (editingList) {
      // Update existing list
      setLists(prevLists => 
        prevLists.map(list => 
          list.id === editingList.id 
            ? {
                ...list,
                title: newListTitle.trim(),
                description: newListDescription.trim(),
                important: newListImportant
              }
            : list
        )
      );
    } else {
      // Add new list
      const newList = {
        id: Date.now().toString(),
        title: newListTitle.trim(),
        description: newListDescription.trim(),
        important: newListImportant,
        createdAt: new Date()
      };
      setLists(prevLists => [newList, ...prevLists]);
    }

    closeModal();
  };

  const deleteList = (listId) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setLists(prevLists => prevLists.filter(list => list.id !== listId));
          }
        }
      ]
    );
  };

  const addBulletPoint = () => {
    const currentDescription = newListDescription;
    const lastChar = currentDescription.slice(-1);
    const prefix = currentDescription && lastChar !== '\n' ? '\n• ' : '• ';
    setNewListDescription(currentDescription + prefix);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const ListCard = ({ list }) => (
    <TouchableOpacity 
      style={[styles.listCard, list.important && styles.importantListCard]}
      onPress={() => openEditModal(list)}
    >
      <View style={styles.listCardHeader}>
        <View style={styles.listCardTitleContainer}>
          <Text style={styles.listCardTitle}>{list.title}</Text>
          {list.important && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantBadgeText}>!</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteList(list.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      {list.description ? (
        <Text style={styles.listCardDescription} numberOfLines={3}>
          {list.description}
        </Text>
      ) : (
        <Text style={styles.emptyDescription}>No items added yet</Text>
      )}
      
      <Text style={styles.listCardDate}>
        Created {formatDate(list.createdAt)}
      </Text>
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
        <Text style={styles.headerTitle}>Shopping Lists</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {lists.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📝</Text>
            <Text style={styles.emptyStateTitle}>No shopping lists yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Create your first shopping list to organize your grocery planning
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={openAddModal}>
              <Text style={styles.emptyStateButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listsContainer}>
            {lists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingList ? 'Edit List' : 'Add List'}
            </Text>
            <TouchableOpacity onPress={saveList}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter list title"
                value={newListTitle}
                onChangeText={setNewListTitle}
                maxLength={50}
              />
            </View>

            {/* Important Toggle */}
            <TouchableOpacity 
              style={styles.importantToggle}
              onPress={() => setNewListImportant(!newListImportant)}
            >
              <View style={styles.importantToggleLeft}>
                <Text style={styles.importantToggleIcon}>!</Text>
                <Text style={styles.importantToggleText}>Mark as important</Text>
              </View>
              <View style={[
                styles.toggleSwitch, 
                newListImportant && styles.toggleSwitchActive
              ]}>
                <View style={[
                  styles.toggleThumb,
                  newListImportant && styles.toggleThumbActive
                ]} />
              </View>
            </TouchableOpacity>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <View style={styles.descriptionHeader}>
                <Text style={styles.inputLabel}>Items</Text>
                <TouchableOpacity 
                  style={styles.bulletButton}
                  onPress={addBulletPoint}
                >
                  <Text style={styles.bulletButtonText}>• Add item</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add your shopping items here..."
                value={newListDescription}
                onChangeText={setNewListDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Helper Text */}
            <Text style={styles.helperText}>
              Tip: Use bullet points to organize your items better
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listsContainer: {
    paddingTop: 20,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  importantListCard: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  importantBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  importantBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  listCardDate: {
    fontSize: 12,
    color: '#999',
  },
  bottomPadding: {
    height: 30,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  modalHeader: {
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
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#2ECC71',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  importantToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  importantToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importantToggleIcon: {
    fontSize: 18,
    color: '#FF6B6B',
    marginRight: 10,
    fontWeight: 'bold',
  },
  importantToggleText: {
    fontSize: 16,
    color: '#333',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#2ECC71',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  bulletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 150,
    maxHeight: 200,
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CartScreen;