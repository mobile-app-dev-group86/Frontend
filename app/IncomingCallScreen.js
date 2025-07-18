import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Vibration,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

export default function IncomingCallScreen({ visible, caller, onEndCall }) {
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let timer;
    let vibrateInterval;

    if (visible) {
      setCallTime(0);
      timer = setInterval(() => setCallTime((prev) => prev + 1), 1000);

      // Wake lock
      activateKeepAwake();

      // Vibrate or haptics
      if (Platform.OS === 'android') {
        Vibration.vibrate([500, 1000], true); // loop pattern
      } else {
        vibrateInterval = setInterval(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error), 1500);
      }
    }

    return () => {
      clearInterval(timer);
      clearInterval(vibrateInterval);
      Vibration.cancel();
      deactivateKeepAwake();
    };
  }, [visible]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: caller.profileImage }} style={styles.profileImage} />
          <Text style={styles.name}>{caller.name}</Text>
          <Text style={styles.timer}>{formatTime(callTime)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.button}>
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCameraOn(!cameraOn)} style={styles.button}>
            <Ionicons name={cameraOn ? 'camera' : 'camera-off'} size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push('/messages');
            }}
            style={styles.button}
          >
            <Ionicons name="chatbubble-ellipses" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('Add user feature to be implemented')}
            style={styles.button}
          >
            <Ionicons name="person-add" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onEndCall} style={[styles.button, styles.endButton]}>
            <Ionicons name="call" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF5E1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 50,
    margin: 10,
  },
  endButton: {
    backgroundColor: '#E53935',
  },
});
