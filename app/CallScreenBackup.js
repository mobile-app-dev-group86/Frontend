import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';

const RINGTONE_OUTGOING = require('../assets/sounds/sound1.mp3');

export default function CallScreen() {
  const router = useRouter();
  const { userId, profile, type } = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(type === 'video');
  const [callTimer, setCallTimer] = useState(0);
  const [sound, setSound] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Start outgoing call ringtone
    playRingtone();

    // Keep screen awake
    // activateKeepAwake(); // Removed due to dependency on react-native-webrtc

    return () => {
      stopRingtone();
      clearInterval(timerRef.current);
      // deactivateKeepAwake(); // Removed due to dependency on react-native-webrtc
    };
  }, []);

  const playRingtone = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(RINGTONE_OUTGOING);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play ringtone:', error);
    }
  };

  const stopRingtone = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallTimer(0);
    router.back();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const formatTimer = () => {
    const mins = Math.floor(callTimer / 60);
    const secs = callTimer % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profile?.image || 'https://placehold.co/100x100' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile?.name || 'User'}</Text>
        <Text style={styles.timer}>{formatTimer()}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>
        {type === 'video' && (
          <TouchableOpacity onPress={toggleCamera} style={styles.button}>
            <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={endCall} style={[styles.button, styles.endButton]}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ffe0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  timer: {
    fontSize: 18,
    color: '#1B5E20',
    marginTop: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
  },
  endButton: {
    backgroundColor: '#E53935',
  },
});
