import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Vibration,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';

// const RINGTONE = require('../assets/sounds/sound1.mp3');
// const NOTIFICATION_SOUND = require('../assets/sounds/sound2.mp3');

export default function PrivateScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(null);
  const [sound, setSound] = useState(null);
  const ringtoneRef = useRef(null);
  const ws = useRef(null);

  const userId = route?.params?.userId;

  useEffect(() => {
    fetch(`https://your-backend.com/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    ws.current = new WebSocket(`wss://your-websocket-url.com/private/${userId}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
        playNotificationSound(); // ✅ Play notification on new message
      }

      if (data.type === 'INCOMING_PRIVATE_CALL') {
        playRingtone();
        if (Platform.OS === 'android') Vibration.vibrate([500, 500, 1000]);
        navigation.navigate('IncomingCallScreen', {
          caller: data.caller,
          type: data.callType || 'audio',
        });
      }
    };

    return () => {
      ws.current?.close();
      stopRingtone();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const msg = { sender: 'me', text: input };
      ws.current?.send(JSON.stringify({ type: 'message', message: msg }));
      setMessages(prev => [...prev, msg]);
      setInput('');
    }
  };

  const playAudio = async (uri) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();
  };

  const playNotificationSound = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(NOTIFICATION_SOUND);
    setSound(newSound);
    await newSound.playAsync();
  };

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const playRingtone = async () => {
    const { sound } = await Audio.Sound.createAsync(RINGTONE);
    ringtoneRef.current = sound;
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  };

  const stopRingtone = async () => {
    if (ringtoneRef.current) {
      await ringtoneRef.current.stopAsync();
      await ringtoneRef.current.unloadAsync();
      ringtoneRef.current = null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender === 'me' ? styles.myMessage : styles.theirMessage}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {profile && (
        <View style={styles.header}>
          <Image source={{ uri: profile.image }} style={styles.profileImage} />
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CallScreen', {
                  userId,
                  profile,
                  type: 'audio',
                });
              }}
            >
              <Ionicons name="call-outline" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CallScreen', {
                  userId,
                  profile,
                  type: 'video',
                });
              }}
            >
              <Ionicons name="videocam-outline" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        style={styles.chatArea}
      />

      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  name: { fontSize: 16, fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 10,
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ccffcc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
});
