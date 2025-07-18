import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Vibration,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";

const CALL_SOCKET_URL = "ws://your-backend-url/group-call";
// const RINGTONE_PATH = require("../assets/sounds/sound1.mp3");

const GroupCallScreen = ({ route, navigation }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState(null);

  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const ws = useRef(null);

  const playRingtone = async () => {
    const { sound } = await Audio.Sound.createAsync(RINGTONE_PATH);
    soundRef.current = sound;
    await sound.playAsync();
  };

  const stopRingtone = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(CALL_SOCKET_URL);

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "INCOMING_GROUP_CALL") {
        setIncomingCaller(data.caller);
        setShowIncomingModal(true);
        playRingtone();
        if (Platform.OS === "android") Vibration.vibrate([1000, 500, 1000]);
      }

      if (data.type === "END_CALL") {
        endCall();
      }
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error:", e.message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.current?.close();
      stopRingtone();
      clearInterval(timerRef.current);
    };
  }, []);

  const acceptCall = () => {
    stopRingtone();
    setShowIncomingModal(false);
    startCallTimer();
    ws.current?.send(JSON.stringify({ type: "ACCEPT_CALL" }));
  };

  const declineCall = () => {
    stopRingtone();
    setShowIncomingModal(false);
    ws.current?.send(JSON.stringify({ type: "DECLINE_CALL" }));
  };

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallTimer(0);
    ws.current?.send(JSON.stringify({ type: "END_CALL" }));
    navigation.goBack();
  };

  const formatTimer = () => {
    const mins = Math.floor(callTimer / 60);
    const secs = callTimer % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Call</Text>
      <Text style={styles.timer}>{formatTimer()}</Text>

      <Image
        source={{ uri: incomingCaller?.profilePicture || "https://placehold.co/100x100" }}
        style={styles.avatar}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.button}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCameraOn(!isCameraOn)} style={styles.button}>
          <Ionicons name={isCameraOn ? "videocam" : "videocam-off"} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <Ionicons name="chatbubble" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <Ionicons name="person-add" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={endCall} style={[styles.button, styles.endButton]}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={showIncomingModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{incomingCaller?.name || "Someone"} is calling...</Text>
          <Image
            source={{ uri: incomingCaller?.profilePicture || "https://placehold.co/100x100" }}
            style={styles.modalAvatar}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={declineCall} style={[styles.button, styles.decline]}>
              <Ionicons name="call" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={acceptCall} style={[styles.button, styles.accept]}>
              <Ionicons name="call" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6ffe6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: "#006400",
    fontWeight: "bold",
    marginBottom: 10,
  },
  timer: {
    fontSize: 18,
    color: "#006400",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 40,
    marginHorizontal: 8,
  },
  endButton: {
    backgroundColor: "#f44336",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    color: "#006400",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 30,
  },
  decline: {
    backgroundColor: "#f44336",
  },
  accept: {
    backgroundColor: "#4CAF50",
  },
});
