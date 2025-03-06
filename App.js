import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { initializeTasks } from "./redux/tasksSlice";
import AppNavigator from "./navigation/AppNavigator";

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTasks());
  }, [dispatch]);

  return <AppNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}