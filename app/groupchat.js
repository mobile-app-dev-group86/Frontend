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
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import MessageBubble from '../components/MessageBubble';
import MessageInputBar from '../components/MessageInputBar';

const CALL_SOCKET_URL = 'ws://your-backend-url/group-call';
const RINGTONE_INCOMING = require('../assets/sounds/sound2.mp3');

export default function GroupChatScreen() {
  const router = useRouter();
  const { groupName, groupImage, groupId, isGroup, callType } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(callType === 'video');
  const [callTimer, setCallTimer] = useState(0);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState(null);
  const [sound, setSound] = useState(null);

  const ws = useRef(null);
  const timerRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket
    ws.current = new WebSocket(CALL_SOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      if (groupId) {
        ws.current.send(JSON.stringify({ type: 'join-group', groupId }));
      }
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'INCOMING_GROUP_CALL':
          setIncomingCaller(data.caller);
          setShowIncomingModal(true);
          await playRingtone();
          if (Platform.OS === 'android') Vibration.vibrate([1000, 500, 1000]);
          break;
        case 'message':
          const updatedMessages = [...messages, data.message];
          setMessages(updatedMessages);
          scrollToEnd();
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    };

    ws.current.onerror = (e) => console.error('WebSocket error:', e.message);
    ws.current.onclose = () => console.log('WebSocket closed');

    // Keep screen awake during call
    activateKeepAwake();

    return () => {
      ws.current?.close();
      stopRingtone();
      clearInterval(timerRef.current);
      deactivateKeepAwake();
    };
  }, [messages]);

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
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = (text) => {
    if (text.trim()) {
      const msg = { sender: 'me', text, id: Date.now().toString() };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      scrollToEnd();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupName || 'Group Chat'}</Text>
        <Text style={styles.timer}>{formatTimer(callTimer)}</Text>
        <Image
          source={{ uri: groupImage || 'https://placehold.co/100x100' }}
          style={styles.avatar}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble message={item} isMe={item.sender === 'me'} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
      />

      <MessageInputBar onSend={sendMessage} />

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>
        {callType === 'video' && (
          <TouchableOpacity onPress={toggleCamera} style={styles.button}>
            <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={28} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => router.push('/messages')} style={styles.button}>
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

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0ffe0',
  },
  header: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#c8facc',
  },
  title: {
    fontSize: 26,
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 18,
    color: '#1B5E20',
    marginVertical: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
  },
  button: {
    padding: 15,
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
