import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to save tasks to AsyncStorage
const saveTasksToStorage = async (tasks) => {
  try {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
};

// Helper function to load tasks from AsyncStorage
const loadTasksFromStorage = async () => {
  try {
    const savedTasks = await AsyncStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return [];
  }
};

const initialState = {
  tasks: [], 
};

// Create the tasks slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Reducer to load tasks into the state
    loadTasks: (state, action) => {
      state.tasks = action.payload;
    },
    // Reducer to add a new task
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      saveTasksToStorage(state.tasks);
    },
    // Reducer to edit an existing task
    editTask: (state, action) => {
      const { id, title, description, priority } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        saveTasksToStorage(state.tasks);
      }
    },
    // Reducer to delete a task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    // Reducer to toggle task completion status
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },
  },
});

// Export actions
export const { loadTasks, addTask, editTask, deleteTask, toggleTaskCompletion } = tasksSlice.actions;

// Thunk to load tasks from AsyncStorage
export const initializeTasks = () => async (dispatch) => {
  const tasks = await loadTasksFromStorage();
  dispatch(loadTasks(tasks));
};

// Export the reducer
export default tasksSlice.reducer;