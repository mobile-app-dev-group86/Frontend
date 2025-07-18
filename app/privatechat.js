import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function PrivateChatScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const { image, username, otherUserId, currentUserId } = useGlobalSearchParams();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("offline"); // "online", "typing", etc.

  // Fetch status of the other user (not yourself)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://your-backend.com/status/${otherUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userId !== currentUserId) {
            setStatus(data.status); // Only show other user's status
          } else {
            setStatus(""); // Don't show your own status
          }
        })
        .catch((err) => {
          console.error("Status fetch error:", err);
          setStatus("offline");
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [otherUserId, currentUserId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "green";
      case "typing":
        return "orange";
      default:
        return "gray";
    }
  };

  const handleSend = () => {
    if (text.trim() !== "") {
      const newMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: "me",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setText("");

      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.profilePic} />
        <View style={styles.nameStatus}>
          <Text style={styles.username}>{username}</Text>
          {!!status && (
            <Text style={[styles.onlineText, { color: getStatusColor(status) }]}>
              {status === "typing" ? "typing..." : status}
            </Text>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message"
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#075e54",
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  nameStatus: {
    marginLeft: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  onlineText: {
    fontSize: 13,
    fontWeight: "500",
  },
  messagesList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#075e54",
    padding: 10,
    borderRadius: 20,
  },
});
