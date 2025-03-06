import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { Button, TextInput, RadioButton, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask } from '../redux/tasksSlice';

const AddEditTaskScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { task } = route.params || {};
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'Low');
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const { colors } = useTheme();

  // Animation for error 
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (titleError || descriptionError) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [titleError, descriptionError]);

  const handleSave = () => {
    setTitleError(!title.trim());
    setDescriptionError(!description.trim());

    if (!title.trim() || !description.trim()) {
      Alert.alert(
        'Validation Error',
        'Please fill in both the title and description fields.',
        [{ text: 'OK' }]
      );
      return; 
    }

    const newTask = {
      id: task?.id || Date.now(),
      title,
      description,
      priority,
      completed: task?.completed || false,
    };

    if (task) {
      dispatch(editTask(newTask));
    } else {
      dispatch(addTask(newTask));
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setTitleError(false);
          }}
          style={styles.input}
          placeholder="Enter task title"
          error={titleError}
          mode="outlined"
          theme={{ colors: { primary: colors.primary } }}
        />
        {titleError && (
          <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>
            Title is required
          </Animated.Text>
        )}

        <TextInput
          label="Description"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setDescriptionError(false);
          }}
          style={styles.input}
          placeholder="Enter task description"
          error={descriptionError}
          mode="outlined"
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: colors.primary } }}
        />
        {descriptionError && (
          <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>
            Description is required
          </Animated.Text>
        )}

        <Text style={styles.priorityLabel}>Priority:</Text>
        <RadioButton.Group onValueChange={setPriority} value={priority}>
          <View style={styles.radioGroup}>
            <RadioButton.Item
              label="Low"
              value="Low"
              color={colors.primary}
              style={styles.radioItem}
            />
            <RadioButton.Item
              label="Medium"
              value="Medium"
              color={colors.primary}
              style={styles.radioItem}
            />
            <RadioButton.Item
              label="High"
              value="High"
              color={colors.primary}
              style={styles.radioItem}
            />
          </View>
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          labelStyle={styles.saveButtonLabel}
          theme={{ colors: { primary: colors.primary } }}
        >
          Save
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, paddingBottom: 16 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  errorText: { color: 'red', marginBottom: 16, fontSize: 14 },
  priorityLabel: { fontSize: 16, marginBottom: 8, color: '#333' },
  radioGroup: { marginBottom: 16 },
  radioItem: { marginBottom: 8 },
  saveButton: { marginTop: 16, borderRadius: 8 },
  saveButtonLabel: { color: '#fff' },
});

export default AddEditTaskScreen;