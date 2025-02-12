import React, { useState, useEffect } from "react";
import { 
  View, TextInput, Button, Platform, KeyboardAvoidingView, Text, TouchableOpacity, Image 
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask } from "../redux/tasksSlice";
import { useRouter, useLocalSearchParams } from "expo-router";
import uuid from "react-native-uuid"; 
import { RootState } from "../redux/store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";  // Import expo-image-picker

export default function AddTaskScreen() {
  const { id } = useLocalSearchParams();
  const taskId = Array.isArray(id) ? id[0] : id;
  const existingTask = useSelector((state: RootState) =>
    state.tasks.find((task) => task.id === taskId)
  );

  const [title, setTitle] = useState<string>(existingTask?.title ?? "");
  const [description, setDescription] = useState<string>(existingTask?.description ?? "");
  const [dueDate, setDueDate] = useState<Date>(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null); // State for image

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || "");
      setDescription(existingTask.description || "");
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate) : new Date());
    }
  }, [existingTask]);

  const handleConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    setDueDate(selectedDate);
  };

  const handleSave = () => {
    if (!title.trim()) return;
  
    if (existingTask) {
      dispatch(editTask({ id: taskId, title, description, dueDate: dueDate.toISOString(), image }));
    } else {
      dispatch(addTask({ id: uuid.v4(), title, description, dueDate: dueDate.toISOString(), image }));
    }
    router.back();
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: "center", padding: 20 }}
    >
      <View>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#888" 
          autoCapitalize="words"
          autoCorrect={false}
          style={{ borderBottomWidth: 1, marginBottom: 10, padding: 10 }}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#888" 
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
          autoCorrect={true}
          multiline
          style={{ borderBottomWidth: 1, marginBottom: 10, padding: 10 }}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={{ borderBottomWidth: 1, marginBottom: 10, padding: 10 }}>
            {dueDate.toDateString()}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setShowDatePicker(false)}
        />

        <Button title={existingTask ? "Update Task" : "Save"} onPress={handleSave} />

        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, marginTop: 10, alignSelf: "center" }}
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={openCamera}
      >
        <Ionicons name="camera" size={30} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = {
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6200ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
};
