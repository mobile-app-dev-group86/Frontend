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
import { RTCView, RTCPeerConnection, MediaStream } from 'react-native-webrtc';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

const CALL_SOCKET_URL = 'wss://your-websocket-url.com/private-call';
const RINGTONE_OUTGOING = require('../assets/sounds/sound1.mp3');

export default function CallScreen() {
  const router = useRouter();
  const { userId, profile, type } = useLocalSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(type === 'video');
  const [callTimer, setCallTimer] = useState(0);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [sound, setSound] = useState(null);
  const ws = useRef(null);
  const pc = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket
    ws.current = new WebSocket(CALL_SOCKET_URL);
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      initiateCall();
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        await handleOffer(data.offer);
      } else if (data.type === 'answer') {
        await handleAnswer(data.answer);
      } else if (data.type === 'ice-candidate') {
        await handleIceCandidate(data.candidate);
      } else if (data.type === 'end-call') {
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
        ws.current?.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };

    pc.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Get local stream
    getMediaStream();

    // Start outgoing call ringtone
    playRingtone();

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
        video: type === 'video' ? { facingMode: 'user' } : false,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));
      if (!isCameraOn && type === 'video') {
        stream.getVideoTracks().forEach((track) => (track.enabled = false));
      }
      if (isMuted) {
        stream.getAudioTracks().forEach((track) => (track.enabled = false));
      }
    } catch (error) {
      console.error('Failed to get media stream:', error);
    }
  };

  const initiateCall = async () => {
    try {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      ws.current?.send(JSON.stringify({ type: 'offer', offer, userId }));
      startCallTimer();
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  const handleOffer = async (offer) => {
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      ws.current?.send(JSON.stringify({ type: 'answer', answer }));
      startCallTimer();
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

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
    ws.current?.send(JSON.stringify({ type: 'end-call' }));
    clearInterval(timerRef.current);
    setCallTimer(0);
    router.back();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (localStream && type === 'video') {
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
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profile?.image || 'https://placehold.co/100x100' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile?.name || 'User'}</Text>
        <Text style={styles.timer}>{formatTimer()}</Text>
      </View>

      {type === 'video' && (
        <View style={styles.videoContainer}>
          {remoteStream && (
            <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
          )}
          {localStream && (
            <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
          )}
        </View>
      )}

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
  videoContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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