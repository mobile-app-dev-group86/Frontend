import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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

const GroupChatScreen = () => {
  const router = useRouter();
  const { groupName = "Group", groupImage = "https://i.pravatar.cc/150?img=5", groupId = "default" } = useLocalSearchParams();
  const userId = "u1"; // Replace with dynamic ID in real app
  const STORAGE_KEY = `group_chat_${groupName}`;

  const [messages, setMessages] = useState([]);
  const [groupStatus, setGroupStatus] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://your-backend.com/api/group/${groupId}/status`)
        .then((res) => res.json())
        .then((data) => {
          const othersTyping = data.typingUsers?.filter((u) => u.userId !== userId);
          if (othersTyping?.length > 0) {
            setGroupStatus(`${othersTyping[0].username} is typing...`);
          } else {
            setGroupStatus(data.status || "");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch status", err);
          setGroupStatus("");
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [groupId]);

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
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
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
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
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
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
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
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{groupName}</Text>
              {!!groupStatus && (
                <Text style={styles.groupStatus}>{groupStatus}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.iconsButton}>
              <Ionicons name="call-outline" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsButton}>
              <Ionicons name="videocam-outline" size={30} color="green" />
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
    paddingTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  groupImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
    marginVertical: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  groupStatus: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  iconsButton: {
    marginLeft: 10,
  },
});

export default GroupChatScreen;
