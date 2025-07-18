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
  Vibration,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageBubble from "../components/MessageBubble";
import MessageInputBar from "../components/MessageInputBar";
import { Audio } from "expo-av";
import { io } from "socket.io-client";

const GroupChatScreen = () => {
  const router = useRouter();
  const {
    groupName = "Group",
    groupImage = "https://i.pravatar.cc/150?img=5",
    groupId = "default",
  } = useLocalSearchParams();

  const userId = "u1"; // TODO: Replace with dynamic ID from auth/user context
  const STORAGE_KEY = `group_chat_${groupName}`;
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [groupStatus, setGroupStatus] = useState("");
  const [socket, setSocket] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    loadMessages();
    setupSocket();
    return () => {
      if (socket) socket.disconnect();
      if (sound) sound.unloadAsync();
    };
  }, []);

  const setupSocket = () => {
    const newSocket = io("https://your-backend.com"); // TODO: Update this URL
    newSocket.emit("joinGroup", { groupId, userId });

    newSocket.on("incoming-group-call", async (data) => {
      if (data.groupId === groupId && data.callerId !== userId) {
        await playRingtone();
        Vibration.vibrate([500, 500, 500], true);
        router.push({
          pathname: "/IncomingCallModal",
          params: {
            callType: data.callType,
            callerName: data.callerName,
            callerImage: data.callerImage,
            groupId: data.groupId,
            isGroup: true,
          },
        });
      }
    });

    setSocket(newSocket);
  };

  const playRingtone = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/sound1.mp3") // PLACE RINGTONE IN `assets/`
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Failed to play ringtone", error);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
        scrollToEnd();
      }
    } catch (e) {
      console.error("Error loading messages:", e);
    }
  };

  const saveMessages = async (updated) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving messages:", e);
    }
  };

  const handleSend = (text) => {
    const newMsg = {
      id: Date.now().toString(),
      text,
      senderId: userId,
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleImage = (uri) => {
    const newMsg = {
      id: Date.now().toString(),
      senderId: userId,
      image: uri,
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleVoice = (uri) => {
    const newMsg = {
      id: Date.now().toString(),
      senderId: userId,
      voice: uri,
      avatar: `https://i.pravatar.cc/100?u=${userId}`,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    scrollToEnd();
  };

  const handleDelete = (id) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    saveMessages(updated);
  };

  const handleForward = (id) => {
    const message = messages.find((m) => m.id === id);
    if (message) Alert.alert("Forwarded", message.text || "(media)");
  };

  const onLongPressMessage = (id) => {
    const options = ["Cancel", "Forward", "Delete"];
    const cancel = 0, del = 2;
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancel, destructiveButtonIndex: del },
        (i) => {
          if (i === 1) handleForward(id);
          if (i === 2) handleDelete(id);
        }
      );
    } else {
      Alert.alert("Options", "", [
        { text: "Forward", onPress: () => handleForward(id) },
        { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const makeCall = (type) => {
    if (socket) {
      socket.emit("initiate-group-call", {
        groupId,
        callerId: userId,
        callType: type,
      });
      router.push({
        pathname: "/CallScreen",
        params: {
          callType: type,
          groupName,
          groupImage,
          isGroup: true,
          groupId,
        },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <View style={styles.wrapper}>
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
            <TouchableOpacity onPress={() => makeCall("voice")} style={styles.iconsButton}>
              <Ionicons name="call-outline" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => makeCall("video")} style={styles.iconsButton}>
              <Ionicons name="videocam-outline" size={30} color="green" />
            </TouchableOpacity>
          </View>

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
