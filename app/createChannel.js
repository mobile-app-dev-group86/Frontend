import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const CreateChannelScreen = () => {
  const router = useRouter(); // ✅ should work in app/ directory screen
  const [channelName, setChannelName] = useState("");
  const [relatedTo, setRelatedTo] = useState("general");

  const handleCreateChannel = () => {
    console.log(`Creating channel: ${channelName} related to ${relatedTo}`);
    router.back(); // ✅ Should work
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Channel</Text>

      <TextInput
        style={styles.input}
        placeholder="Channel Name"
        value={channelName}
        onChangeText={setChannelName}
      />

      <Text style={styles.label}>Related To:</Text>

      <Picker
        selectedValue={relatedTo}
        onValueChange={(itemValue) => setRelatedTo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="General" value="general" />
        <Picker.Item label="Announcements" value="announcements" />
        <Picker.Item label="Events" value="events" />
        <Picker.Item label="Gaming" value="gaming" />
        <Picker.Item label="Voice Chat" value="voice_chat" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleCreateChannel}>
        <Text style={styles.buttonText}>Create Channel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#1d7036",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateChannelScreen;
