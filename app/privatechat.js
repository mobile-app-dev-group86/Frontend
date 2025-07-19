import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageBubble from '../components/MessageBubble';
import MessageInputBar from '../components/MessageInputBar';

const RINGTONE = require('../assets/sounds/sound2.mp3');
const NOTIFICATION_SOUND = require('../assets/sounds/sound2.mp3');

export default function PrivateScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [sound, setSound] = useState(null);
  const ringtoneRef = useRef(null);
  const ws = useRef(null);
  const flatListRef = useRef(null);
  const STORAGE_KEY = `private_chat_${userId}`;

  useEffect(() => {
    // Fetch user profile
    fetch(`https://your-backend.com/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error('Profile fetch error:', err));

    // Load stored messages
    loadMessages();
  }, [userId]);

  useEffect(() => {
    // Initialize WebSocket
    ws.current = new WebSocket(`wss://your-websocket-url.com/private/${userId}`);

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        const updatedMessages = [...messages, data.message];
        setMessages(updatedMessages);
        await saveMessages(updatedMessages);
        playNotificationSound();
        scrollToEnd();
      }

      if (data.type === 'INCOMING_PRIVATE_CALL') {
        await playRingtone();
        if (Platform.OS === 'android') Vibration.vibrate([500, 500, 1000]);
        router.push({
          pathname: '/IncomingCallScreen',
          params: { caller: JSON.stringify(data.caller), type: data.callType || 'audio' },
        });
      }
    };

    ws.current.onerror = (e) => console.error('WebSocket error:', e);
    ws.current.onclose = () => console.log('WebSocket closed');

    return () => {
      ws.current?.close();
      stopRingtone();
      sound?.unloadAsync();
    };
  }, [messages]);

  const getToken = async () => {
    // Replace with your auth token retrieval logic
    return await AsyncStorage.getItem('jwt_token');
  };

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
        scrollToEnd();
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
  };

  const saveMessages = async (updated) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text) => {
    if (text.trim()) {
      const msg = { sender: 'me', text, id: Date.now().toString() };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      scrollToEnd();
    }
  };

  const handleImage = async (uri) => {
    const fileUrl = await uploadFile(uri);
    if (fileUrl) {
      const msg = { sender: 'me', image: fileUrl, id: Date.now().toString() };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      scrollToEnd();
    }
  };

  const handleVoice = async (uri) => {
    const fileUrl = await uploadFile(uri);
    if (fileUrl) {
      const msg = { sender: 'me', voice: fileUrl, id: Date.now().toString() };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      scrollToEnd();
    }
  };

  const handleDocument = async (uri, name) => {
    const fileUrl = await uploadFile(uri, name);
    if (fileUrl) {
      const msg = { sender: 'me', document: fileUrl, name, id: Date.now().toString() };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      const updatedMessages = [...messages, msg];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
      scrollToEnd();
    }
  };

  const uploadFile = async (uri, name = null) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: name || `file_${Date.now()}`,
        type: name ? 'application/octet-stream' : 'image/jpeg',
      });
      const response = await fetch('https://your-backend.com/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.ok) throw new Error('Upload failed');
      return await response.text();
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  };

  const playNotificationSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(NOTIFICATION_SOUND);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  const playRingtone = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(RINGTONE);
      ringtoneRef.current = sound;
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play ringtone:', error);
    }
  };

  const stopRingtone = async () => {
    if (ringtoneRef.current) {
      await ringtoneRef.current.stopAsync();
      await ringtoneRef.current.unloadAsync();
      ringtoneRef.current = null;
    }
  };

  const handleLongPress = (id) => {
    // Implement delete/forward logic similar to GroupChatScreen
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <View style={styles.container}>
          {profile ? (
            <View style={styles.header}>
              <Image
                source={{ uri: profile.image || 'https://placehold.co/40x40' }}
                style={styles.profileImage}
                onError={() => console.warn('Failed to load profile image')}
              />
              <Text style={styles.name}>{profile.name || 'User'}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/CallScreen',
                      params: { userId, profile: JSON.stringify(profile), type: 'audio' },
                    })
                  }
                >
                  <Ionicons name="call-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/CallScreen',
                      params: { userId, profile: JSON.stringify(profile), type: 'video' },
                    })
                  }
                >
                  <Ionicons name="videocam-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.header}>
              <Text style={styles.name}>Loading...</Text>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isMe={item.sender === 'me'}
                onLongPress={() => handleLongPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10 }}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
          />

          <MessageInputBar
            onSend={sendMessage}
            onImage={handleImage}
            onVoice={handleVoice}
            onDocument={handleDocument}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0ffe0',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  actions: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 10,
  },
});