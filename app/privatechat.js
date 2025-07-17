import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageBubble from "../components/MessageBubble";
import MessageInputBar from "../components/MessageInputBar";

const PrivateChatScreen = ({ route }) => {
  const router = useRouter();

  const userId = "u1";
  const otherUserId = route?.params?.userId || "u2";
  const otherName = route?.params?.name || "User";
  const otherAvatar = route?.params?.avatar || "https://example.com/avatar.png";
  const STORAGE_KEY = `private_chat_${userId}_${otherUserId}`;

  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
        scrollToEnd();
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
  };

  const saveMessages = async (updated) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save messages:", e);
    }
  };

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      senderId: userId,
      receiverId: otherUserId,
      avatar: "https://example.com/avatar.png",
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleImage = (uri) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      image: uri,
      avatar: "https://i.pravatar.cc/300?img=1",
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleVoice = (uri) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      voice: uri,
      avatar: "https://example.com/avatar.png",
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleDelete = (messageId) => {
    const updated = messages.filter((msg) => msg.id !== messageId);
    setMessages(updated);
    saveMessages(updated);
  };

  const handleForward = (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      Alert.alert("Forwarded Message", message.text || "(media)");
    }
  };

  const onLongPressMessage = (messageId) => {
    const options = ["Cancel", "Forward", "Delete"];
    const cancelButtonIndex = 0;
    const deleteButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex: deleteButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleForward(messageId);
          if (buttonIndex === 2) handleDelete(messageId);
        }
      );
    } else {
      Alert.alert("Message Options", "Choose an action", [
        { text: "Forward", onPress: () => handleForward(messageId) },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(messageId),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <View style={styles.wrapper}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Image source={{ uri: otherAvatar }} style={styles.useravatar} />
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{otherName}</Text>
              <Text style={styles.onlineText}>online</Text>
            </View>
            <TouchableOpacity style={styles.iconsButton}>
              <Ionicons name="call-outline" size={20} color="#7aff58" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsButton}>
              <Ionicons name="videocam-outline" size={20} color="#7aff58" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isMe={item.senderId === userId}
                onLongPress={() => onLongPressMessage(item.id)}
              />
            )}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60, paddingHorizontal: 10 }}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input */}
          <MessageInputBar
            onSend={handleSend}
            onImage={handleImage}
            onVoice={handleVoice}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 20, // Added to shift header downward
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  useravatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
    marginVertical: 16, // Added for vertical spacing
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  onlineText: {
    fontSize: 12,
    color: "green",
  },
  iconsButton: {
    marginLeft: 10,
  },
});

export default PrivateChatScreen;