import React, { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CreateChannelScreen() {
  const router = useRouter();
  const { serverId } = useLocalSearchParams(); // 👈 make sure this is passed from previous screen
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState("text"); // text or voice
  const [loading, setLoading] = useState(false);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      Alert.alert("Error", "Channel name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://your-backend-url/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: channelName.trim(),
          relatedTo: channelType,
          serverId: serverId, // 👈 links to server
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert("Success", "Channel created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
      <Text style={styles.heading}>Create a Channel</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter channel name"
        value={channelName}
        onChangeText={setChannelName}
      />

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            channelType === "text" && styles.activeType,
          ]}
          onPress={() => setChannelType("text")}
        >
          <Text
            style={[
              styles.typeText,
              channelType === "text" && styles.activeTypeText,
            ]}
          >
            Text
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            channelType === "voice" && styles.activeType,
          ]}
          onPress={() => setChannelType("voice")}
        >
          <Text
            style={[
              styles.typeText,
              channelType === "voice" && styles.activeTypeText,
            ]}
          >
            Voice
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateChannel}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Channel</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    paddingTop: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "40%",
    alignItems: "center",
  },
  activeType: {
    backgroundColor: "green",
    borderColor: "green",
  },
  typeText: {
    color: "#555",
    fontWeight: "500",
  },
  activeTypeText: {
    color: "#fff",
  },
  createButton: {
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
