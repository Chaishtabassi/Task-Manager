import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Task List" }} />
        <Stack.Screen name="add-task" options={{ title: "Add Task" }} />
        <Stack.Screen name="task-detail" options={{ title: "Task Details" }} />
        <Stack.Screen name="edit-task" options={{ title: "Edit Task Details" }} />
      </Stack>
    </Provider>
  );
}
