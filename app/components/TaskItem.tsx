import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { removeTask } from "../redux/tasksSlice";

interface TaskItemProps {
  id: string;
  title: string;
  dueDate?: string; 
}

export default function TaskItem({ id, title, dueDate }: TaskItemProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={styles.taskContainer}
      onPress={() => router.push(`/task-detail?id=${id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dueDate || "No due date"}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => dispatch(removeTask(id))}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
