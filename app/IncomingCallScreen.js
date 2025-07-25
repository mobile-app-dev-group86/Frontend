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
  Modal as RNModal,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av'; // Revert to expo-av package due to missing expo-audio
import { useCallContext } from '../contexts/CallContext';

export default function IncomingCallScreen({ 
  visible, 
  caller, 
  onAccept, 
  onDecline, 
  incoming = true // default to incoming call
}) {
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true); // camera is on/off
  const [videoOn, setVideoOn] = useState(true); // video is on/off
  const [cameraType, setCameraType] = useState('front'); // 'front' or 'back'
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [sound, setSound] = useState(null);
  const router = useRouter();
  const { sendCallResponse } = useCallContext();
  const friendsList = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

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
      const soundFile = require('../assets/sounds/sound2.mp3');
      await newSound.loadAsync(soundFile);
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

  const handleMute = () => {
    setIsMuted((prev) => !prev);
    // TODO: Integrate mute with backend
  };
  const handleToggleCamera = () => {
    setCameraType((prev) => (prev === 'front' ? 'back' : 'front'));
    // TODO: Integrate camera switch (front/back) with backend
  };
  const handleToggleVideo = () => {
    setVideoOn((prev) => !prev);
    setCameraOn((prev) => !prev);
    // TODO: Integrate video on/off with backend
  };
  const handleSpeaker = () => {
    setSpeakerOn((prev) => !prev);
    // TODO: Integrate speaker toggle with backend
  };
  const handleAddPeople = () => {
    setShowFriendsModal(true);
  };
  const handleSelectFriend = (friend) => {
    setShowFriendsModal(false);
    // TODO: Integrate invite friend to call with backend
    alert(`Invite sent to ${friend.name}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Back Arrow */}
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileContainer}>
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
            <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{flexGrow: 1}}>
              <View style={styles.videoContainer}>
                <View style={styles.remoteVideo}>
                  <Text style={styles.videoPlaceholder}>Video</Text>
                  <Text style={styles.videoNote}> not available </Text>
                </View>
                <View style={styles.localVideo}>
                  <Text style={styles.videoPlaceholder}> Video</Text>
                </View>
                {/* User names below video */}
                <View style={{alignItems: 'center', marginTop: 12}}>
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                    {caller?.name ?? 'Unknown Caller'}
                  </Text>
                  {/* Add more user names here if needed */}
                </View>
                <View style={styles.controlsPyramidBottom}>
                  {/* Single row of larger buttons, no chat button */}
                  <View style={styles.bottomRowButtonsCompact}>
                    <TouchableOpacity onPress={handleMute} style={[styles.compactButtonLarge, isMuted && styles.activeButton]}>
                      <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToggleVideo} style={[styles.compactButtonLarge, !videoOn && styles.activeButton]}>
                      <MaterialCommunityIcons name={videoOn ? 'video' : 'video-off'} size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToggleCamera} style={styles.compactButtonLarge}>
                      <MaterialCommunityIcons name={cameraType === 'front' ? 'camera-switch' : 'camera'} size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSpeaker} style={[styles.compactButtonLarge, speakerOn && styles.activeButton]}>
                      <MaterialCommunityIcons name="volume-high" size={26} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.compactButtonLarge} onPress={handleAddPeople}>
                      <Ionicons name="person-add" size={26} color="white" />
                    </TouchableOpacity>
                  </View>
                  {/* Large end call button centered below */}
                  <View style={styles.endCallRow}>
                    <TouchableOpacity onPress={handleEndCall} style={[styles.button, styles.endButton]}>
                      <Ionicons name="call" size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
        {/* Friends List Modal */}
        <RNModal
          visible={showFriendsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFriendsModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 300, maxHeight: 400 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Invite a Friend</Text>
              <FlatList
                data={friendsList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectFriend(item)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowFriendsModal(false)} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
                <Text style={{ color: '#E53935', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RNModal>
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
    backgroundColor: 'transparent',
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
    color: 'black',
  },
  timer: {
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
  incomingText: {
    fontSize: 18,
    color: 'black',
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
    backgroundColor: 'green',
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
  speakerLargeButton: {
    transform: [{ scale: 1.3 }],
    backgroundColor: '#388e3c', // Optional: make it stand out more
  },
  controlsPyramid: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  rowPyramid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 20,
  },
  rowPyramidSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  controlsPyramidBottom: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomRowButtonsCompact: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  compactButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 24,
    marginHorizontal: 4,
  },
  compactButtonLarge: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 28,
    marginHorizontal: 6,
  },
  endCallRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
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
