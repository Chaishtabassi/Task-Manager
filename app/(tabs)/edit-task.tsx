import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { RootState } from "../redux/store";
import { editTask } from "../redux/tasksSlice"; 

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const taskId = Array.isArray(id) ? id[0] : id;
  const task = useSelector((state: RootState) =>
    state.tasks.find((t) => t.id === taskId)
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : new Date());
      setImage(task.image || null);
    }
  }, [task]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title cannot be empty.");
      return;
    }

    dispatch(editTask({ 
      id: taskId, 
      title, 
      description, 
      dueDate: dueDate.toISOString(),
      image, 
    }));

    Alert.alert("Success", "Task updated successfully.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]} 
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      <Text style={styles.label}>Due Date:</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setOpen(true)}>
        <Text style={styles.dateText}>{dueDate.toDateString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={open} 
        date={dueDate}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDueDate(date);
        }}
        onCancel={() => setOpen(false)}
      />

      <Text style={styles.label}>Task Image:</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an Image" onPress={pickImage} />
<View style={{height:30}}></View>
      <Button title="Update Task" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top", 
  },
  dateInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
  },
});
