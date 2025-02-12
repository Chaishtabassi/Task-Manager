import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeTask } from "../redux/tasksSlice";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <TextInput
        placeholder="Search tasks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.taskItem} 
            onPress={() => router.push(`/task-detail?id=${item.id}`)}
          >
            <View style={styles.taskRow}>
            {item.image && ( 
                  <Image source={{ uri: item.image }} style={styles.taskImage} />
                )}
              <View>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>
                  {item.description ? item.description : "No description available"}
                </Text>
                <Text style={styles.taskDate}>
                  Date: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"}
                </Text>
              </View>
        
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => router.push({ pathname: "/edit-task", params: { id: item.id } })}>
                  <MaterialCommunityIcons name="pencil" size={24} color="blue" />
                </TouchableOpacity>
        
                <TouchableOpacity onPress={() => dispatch(removeTask(item.id))}>
                  <MaterialCommunityIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks found.</Text>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/add-task")}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 5,
    borderRadius: 8,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "gray",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  taskImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginTop: 10,
  },
  noTaskText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ee",
  },
});
