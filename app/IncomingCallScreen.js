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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av'; // Revert to expo-av package due to missing expo-audio
import { useCallContext } from '../contexts/CallContext';

export default function IncomingCallScreen({ 
  visible, 
  caller, 
  onAccept, 
  onDecline 
}) {
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [sound, setSound] = useState(null);
  const router = useRouter();
  const { sendCallResponse } = useCallContext();

  useEffect(() => {
    let timer;
    let vibrateInterval;

    if (visible && !isCallAccepted) {
      playIncomingCallSound();
      if (Platform.OS !== 'web') {
        activateKeepAwake();
      }
      if (Platform.OS === 'android') {
        Vibration.vibrate([500, 1000], true);
      } else if (Platform.OS === 'ios') {
        vibrateInterval = setInterval(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }, 1500);
      }
    }

    if (visible && isCallAccepted) {
      setCallTime(0);
      timer = setInterval(() => setCallTime((prev) => prev + 1), 1000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(vibrateInterval);
      if (Platform.OS !== 'web') {
        Vibration.cancel();
        deactivateKeepAwake();
      }
      stopIncomingCallSound();
    };
  }, [visible, isCallAccepted]);

  const playIncomingCallSound = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
      const newSound = new Audio.Sound();
      await newSound.loadAsync(require('../assets/sounds/sound2.mp3'));
      await newSound.setIsLoopingAsync(true);
      await newSound.setVolumeAsync(0.8);
      await newSound.playAsync();
      setSound(newSound);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const stopIncomingCallSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.log('Error stopping sound:', error);
      }
    }
  };

  const handleAcceptCall = async () => {
    await stopIncomingCallSound();
    setIsCallAccepted(true);
    sendCallResponse('ACCEPT_CALL', caller.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onAccept();
  };

  const handleDeclineCall = async () => {
    await stopIncomingCallSound();
    sendCallResponse('DECLINE_CALL', caller.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDecline();
  };

  const handleEndCall = async () => {
    await stopIncomingCallSound();
    sendCallResponse('END_CALL', caller.id);
    setIsCallAccepted(false);
    setCallTime(0);
    onDecline();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: caller?.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{caller?.name ?? 'Unknown Caller'}</Text>
          {isCallAccepted ? (
            <Text style={styles.timer}>{formatTime(callTime)}</Text>
          ) : (
            <Text style={styles.incomingText}>Incoming call...</Text>
          )}
        </View>

        {!isCallAccepted ? (
          <View style={styles.incomingControls}>
            <TouchableOpacity onPress={handleDeclineCall} style={[styles.callButton, styles.declineButton]}>
              <Ionicons name="call" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAcceptCall} style={[styles.callButton, styles.acceptButton]}>
              <Ionicons name="call" size={32} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleMute} style={[styles.button, isMuted && styles.activeButton]}>
              <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCamera} style={[styles.button, !cameraOn && styles.activeButton]}>
              <Ionicons name={cameraOn ? 'camera' : 'camera-off'} size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/privatechat')} style={styles.button}>
              <Ionicons name="chatbubble-ellipses" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Add user feature to be implemented')} style={styles.button}>
              <Ionicons name="person-add" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEndCall} style={[styles.button, styles.endButton]}>
              <Ionicons name="call" size={28} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {isCallAccepted && (
          <View style={styles.videoContainer}>
            <View style={styles.remoteVideo}>
              <Text style={styles.videoPlaceholder}>Video</Text>
              <Text style={styles.videoNote}> not available </Text>
            </View>
            <View style={styles.localVideo}>
              <Text style={styles.videoPlaceholder}> Video</Text>
            </View>
          </View>
        )}
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
    backgroundColor: '#E0E0E0',
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
  incomingText: {
    fontSize: 18,
    color: '#1B5E20',
    marginTop: 5,
    fontStyle: 'italic',
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 40,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#E53935',
    transform: [{ rotate: '135deg' }],
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
  activeButton: {
    backgroundColor: '#2E7D32',
  },
  endButton: {
    backgroundColor: '#E53935',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoNote: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
