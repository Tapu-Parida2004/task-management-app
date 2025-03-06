import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaskListScreen from "../screens/TaskListScreen";
import AddEditTaskScreen from "../screens/AddEditTaskScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: "Tasks" }}
        />
        <Stack.Screen
          name="AddEditTask"
          component={AddEditTaskScreen}
          options={{ title: "Add/Edit Task" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
