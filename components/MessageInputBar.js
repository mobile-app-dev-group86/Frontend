

import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

const MessageInputBar = ({ onSend, onImage, onVoice }) => {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant microphone permission.");
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      onImage(result.assets[0].uri);
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      // Stop and save
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        onVoice(uri);
      }
    } else {
      // Start recording
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
      } catch (err) {
        console.error("Failed to start recording:", err);
        Alert.alert("Error", "Could not start recording.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Ionicons name="image" size={24} color="#888" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleRecording}>
        <Ionicons
          name={recording ? "stop-circle" : "mic"}
          size={24}
          color={recording ? "red" : "#888"}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send" size={24} color="#7aff58" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default MessageInputBar;