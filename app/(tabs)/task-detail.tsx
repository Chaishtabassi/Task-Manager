import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeTask } from "../redux/tasksSlice";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const taskId = Array.isArray(id) ? id[0] : id; // Ensure it's a string
  const task = useSelector((state: RootState) =>
    state.tasks.find((t) => t.id === taskId)
  );
  const dispatch = useDispatch();
  const router = useRouter();

  if (!taskId) return <Text style={styles.errorText}>Invalid Task ID</Text>;
  if (!task) return <Text style={styles.errorText}>Task not found</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>Due: {task.dueDate || "No due date"}</Text>
        <Button
          title="Delete Task"
          onPress={() => {
            dispatch(removeTask(taskId));
            router.back();
          }}
          color="red"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 50,
  },
});
