import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const OUTGOING_SOUND = require('../assets/sounds/sound1.mp3');

export default function CallScreen({
  visible,
  callee,
  onEndCall,
  onAnswered,
  callAnswered = false,
  type = 'voice', // 'voice' or 'video'
}) {
  const [sound, setSound] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    if (visible && !callAnswered) {
      playOutgoingCallSound();
    }
    return () => {
      isMounted = false;
      stopOutgoingCallSound();
    };
    // eslint-disable-next-line
  }, [visible, callAnswered]);

  useEffect(() => {
    if (callAnswered) {
      stopOutgoingCallSound();
      if (onAnswered) onAnswered();
    }
    // eslint-disable-next-line
  }, [callAnswered]);

  const playOutgoingCallSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(OUTGOING_SOUND);
      setSound(newSound);
      await newSound.setIsLoopingAsync(true);
      await newSound.setVolumeAsync(0.8);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play outgoing call sound:', error);
    }
  };

  const stopOutgoingCallSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        // ignore
      }
    }
  };

  const handleEndCall = async () => {
    await stopOutgoingCallSound();
    if (onEndCall) onEndCall();
    router.back();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Back Arrow */}
          <View style={styles.backButton}>
            <TouchableOpacity onPress={handleEndCall} style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileContainer}>
            {type === 'video' ? (
              <View style={styles.videoPlaceholderBox}>
                <Text style={styles.videoPlaceholder}>Video</Text>
              </View>
            ) : (
              <View style={styles.profileCircle}>
                <Image
                  source={callee?.image ? { uri: callee.image } : require('../assets/images/default-avatar.jpeg')}
                  style={styles.profileImage}
                />
              </View>
            )}
            <Text style={styles.name}>{callee?.name || 'User'}</Text>
            <Text style={styles.incomingText}>Calling...</Text>
          </View>
          {/* End Call Button */}
          <View style={styles.endCallRow}>
            <TouchableOpacity onPress={handleEndCall} style={[styles.button, styles.endButton]}>
              <Ionicons name="call" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  profileCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  videoPlaceholderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  videoPlaceholder: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  incomingText: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
    fontStyle: 'italic',
  },
  endCallRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 50,
    margin: 10,
  },
  endButton: {
    backgroundColor: '#E53935',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
