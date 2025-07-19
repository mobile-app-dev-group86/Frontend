import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Platform,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { RTCView, RTCPeerConnection, MediaStream } from 'react-native-webrtc';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

const CALL_SOCKET_URL = 'ws://your-backend-url/group-call';
const RINGTONE_INCOMING = require('../assets/sounds/sound2.mp3');

export default function GroupCallScreen() {
  const router = useRouter();
  const { groupName, groupImage, groupId, isGroup, callType } = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(callType === 'video');
  const [callTimer, setCallTimer] = useState(0);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [sound, setSound] = useState(null);
  const ws = useRef(null);
  const pc = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket
    ws.current = new WebSocket(CALL_SOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current.send(JSON.stringify({ type: 'join-group', groupId }));
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'INCOMING_GROUP_CALL') {
        setIncomingCaller(data.caller);
        setShowIncomingModal(true);
        await playRingtone();
        if (Platform.OS === 'android') Vibration.vibrate([1000, 500, 1000]);
      } else if (data.type === 'offer') {
        await handleOffer(data.offer, data.callerId);
      } else if (data.type === 'answer') {
        await handleAnswer(data.answer, data.callerId);
      } else if (data.type === 'ice-candidate') {
        await handleIceCandidate(data.candidate, data.callerId);
      } else if (data.type === 'END_CALL') {
        endCall();
      }
    };

    ws.current.onerror = (e) => console.error('WebSocket error:', e);
    ws.current.onclose = () => console.log('WebSocket closed');

    // Initialize WebRTC
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(JSON.stringify({ 
          type: 'ice-candidate', 
          candidate: event.candidate,
          groupId 
        }));
      }
    };

    pc.current.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const existing = prev.find((s) => s.id === event.streams[0].id);
        if (!existing) {
          return [...prev, event.streams[0]];
        }
        return prev;
      });
    };

    // Get local stream
    getMediaStream();

    // Keep screen awake
    activateKeepAwake();

    return () => {
      ws.current?.close();
      pc.current?.close();
      stopRingtone();
      clearInterval(timerRef.current);
      deactivateKeepAwake();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video' ? { facingMode: 'user' } : false,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
      if (!isCameraOn && callType === 'video') {
        stream.getVideoTracks().forEach((track) => (track.enabled = false));
      }
      if (isMuted) {
        stream.getAudioTracks().forEach((track) => (track.enabled = false));
      }
    } catch (error) {
      console.error('Failed to get media stream:', error);
    }
  };

  const handleOffer = async (offer, callerId) => {
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      ws.current?.send(JSON.stringify({ 
        type: 'answer', 
        answer, 
        groupId, 
        callerId 
      }));
      startCallTimer();
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async (answer, callerId) => {
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleIceCandidate = async (candidate, callerId) => {
    try {
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

  const playRingtone = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(RINGTONE_INCOMING);
      setSound(newSound);
      await newSound.setIsLoopingAsync(true);
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

  const acceptCall = () => {
    stopRingtone();
    setShowIncomingModal(false);
    startCallTimer();
    ws.current?.send(JSON.stringify({ type: 'ACCEPT_CALL', groupId }));
  };

  const declineCall = () => {
    stopRingtone();
    setShowIncomingModal(false);
    ws.current?.send(JSON.stringify({ type: 'DECLINE_CALL', groupId }));
    router.back();
  };

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallTimer(0);
    ws.current?.send(JSON.stringify({ type: 'END_CALL', groupId }));
    router.back();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    }
    setIsCameraOn(!isCameraOn);
  };

  const formatTimer = () => {
    const mins = Math.floor(callTimer / 60);
    const secs = callTimer % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupName || 'Group Call'}</Text>
        <Text style={styles.timer}>{formatTimer()}</Text>
        <Image
          source={{ uri: groupImage || 'https://placehold.co/100x100' }}
          style={styles.avatar}
        />
      </View>

      {callType === 'video' && (
        <View style={styles.videoContainer}>
          {remoteStreams.map((stream, index) => (
            <RTCView
              key={stream.id}
              streamURL={stream.toURL()}
              style={styles.remoteVideo}
            />
          ))}
          {localStream && (
            <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
          )}
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>
        {callType === 'video' && (
          <TouchableOpacity onPress={toggleCamera} style={styles.button}>
            <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push('/messages')}
          style={styles.button}
        >
          <Ionicons name="chatbubble" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={endCall} style={[styles.button, styles.endButton]}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={showIncomingModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {incomingCaller?.name || 'Someone'} is calling...
          </Text>
          <Image
            source={{ uri: incomingCaller?.profilePicture || 'https://placehold.co/100x100' }}
            style={styles.modalAvatar}
          />
          {localStream && callType === 'video' && (
            <RTCView streamURL={localStream.toURL()} style={styles.modalPreview} />
          )}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ffe0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 18,
    color: '#1B5E20',
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  remoteVideo: {
    width: '45%',
    height: 200,
    margin: 5,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  localVideo: {
    width: 120,
    height: 160,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 40,
  },
  endButton: {
    backgroundColor: '#E53935',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    color: '#1B5E20',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 25,
  },
  modalPreview: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 30,
  },
  decline: {
    backgroundColor: '#E53935',
  },
  accept: {
    backgroundColor: '#4CAF50',
  },
});