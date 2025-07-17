

import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MessageBubble({ message, isMe, onLongPress }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const playSound = async () => {
    try {
      if (!message.voice) return;

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: message.voice },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const openFullImage = () => {
    if (message.image) {
      console.log('Image tapped:', message.image); // Debug log
      router.push('/ViewImage', { uri: encodeURIComponent(message.image) });
    }
  };

  return (
    <TouchableOpacity
      onPress={openFullImage}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
        {message.text && <Text style={styles.text}>{message.text}</Text>}
        {message.image && (
          <Image
            source={{ uri: message.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {message.voice && (
          <TouchableOpacity onPress={playSound} style={styles.audio}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
            <Text style={styles.audioText}>{isPlaying ? "Playing..." : "Play Voice"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    margin: 8,
    padding: 12,
    borderRadius: 10,
    maxWidth: "75%",
  },
  me: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  other: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  audio: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7aff58",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  audioText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
});