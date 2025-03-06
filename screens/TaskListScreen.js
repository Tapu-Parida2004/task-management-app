import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Button, Card, Text, Checkbox, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, toggleTaskCompletion } from '../redux/tasksSlice';

const TaskListScreen = ({ navigation }) => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Open delete confirmation modal
  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDeleteModalVisible(false);
      setTaskToDelete(null);
    });
  };

  // Handle task deletion
  const handleDelete = () => {
    dispatch(deleteTask(taskToDelete));
    closeDeleteModal();
  };

  // Render each task item
  const renderTask = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={[styles.title, item.completed && styles.completedTitle]}>{item.title}</Text>
        <Text style={item.completed && styles.completedText}>{item.description}</Text>
        <Text style={item.completed && styles.completedText}>Priority: {item.priority}</Text>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => dispatch(toggleTaskCompletion(item.id))}
          color="#6200ee"
        />
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="pencil"
          onPress={() => navigation.navigate('AddEditTask', { task: item })}
          color="#6200ee"
        />
        <IconButton
          icon="delete"
          onPress={() => openDeleteModal(item.id)}
          color="#ff4444"
        />
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddEditTask')}
        style={styles.addButton}
        labelStyle={styles.addButtonLabel}
      >
        Add Task
      </Button>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={closeDeleteModal} style={styles.modalButton}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleDelete} style={styles.modalButton} color="#ff4444">
                Delete
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  listContent: { paddingBottom: 16 },
  card: { marginBottom: 16, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  completedTitle: { textDecorationLine: 'line-through', color: '#888' },
  completedText: { textDecorationLine: 'line-through', color: '#888' },
  addButton: { marginTop: 16, borderRadius: 8 },
  addButtonLabel: { color: '#fff' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalText: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, marginHorizontal: 8 },
});

export default TaskListScreen;