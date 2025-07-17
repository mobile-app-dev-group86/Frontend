import { useRouter } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function sendfriendrequest() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Back Arrow */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {/* Middle content */}
          <Text style={styles.header}>Add by Username</Text>
          <Text style={styles.subheader}>Who would you like to add as a friend?</Text>

          {/* Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter a username"
            placeholderTextColor="#A0AEC0"
          />

          {/* Spacer to push button to bottom */}
          <View style={{ flex: 1 }} />

          {/* Send Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send Friend Request</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  backButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginTop: 30,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
    textAlign: "center",
  },
  input: {
    marginTop: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "black",
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
