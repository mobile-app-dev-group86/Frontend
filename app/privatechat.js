

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GamesModal from './components/GamesModal';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const emojiList = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🎉', '😎', '🤔', '🙏', '🥳', '😡', '💯', '🤩', '😅', '😇', '😏', '😬', '😴', '🤯', '😱', '😜', '😋', '😤', '😈', '👀', '🙌', '🤗', '😃', '😆', '😝', '😳', '😔', '😩', '😢', '😭', '😤', '😡', '🤬', '🤡', '💩', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const [recording, setRecording] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [playingUri, setPlayingUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [showGamesModal, setShowGamesModal] = useState(false);

  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const confirmDeleteMessage = (id) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteMessage(id) },
      ]
    );
  };

  const handleReactToMessage = (id) => {
    setSelectedMessageId(id);
    setEmojiModalVisible(true);
  };

  const setReaction = (id, emoji) => {
    setMessages((prev) => prev.map((msg) => {
      if (msg.id !== id) return msg;
      let reactions = Array.isArray(msg.reactions) ? [...msg.reactions] : [];
      reactions.push(emoji);
      return { ...msg, reactions };
    }));
    setEmojiModalVisible(false);
    setSelectedMessageId(null);
  };

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: input }]);
    setInput('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const startTimer = () => {
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    setRecordingInterval(interval);
  };

  const stopTimer = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      startTimer();
    } catch (err) {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      stopTimer();
      if (uri) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            audio: uri,
            avatar: 'https://i.imgur.com/3G4hKLP.png',
          },
        ]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not stop recording.');
    }
  };

  const handleMicPressIn = async () => {
    if (!recording) {
      await startRecording();
    }
  };

  const handleMicPressOut = async () => {
    if (recording) {
      await stopRecording();
    }
  };

  const playAudio = async (uri) => {
    try {
      if (playingSound && playingUri === uri) {
        // Pause if already playing this audio
        await playingSound.pauseAsync();
        setIsPlaying(false);
        return;
      }
      if (playingSound) {
        await playingSound.stopAsync();
        await playingSound.unloadAsync();
        setPlayingSound(null);
        setPlayingUri(null);
        setIsPlaying(false);
      }
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingSound(sound);
      setPlayingUri(uri);
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          setIsPlaying(true);
        } else if (status.didJustFinish) {
          sound.unloadAsync();
          setPlayingSound(null);
          setPlayingUri(null);
          setIsPlaying(false);
        } else if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      Alert.alert('Error', 'Could not play audio.');
    }
  };

  const resumeAudio = async () => {
    if (playingSound) {
      await playingSound.playAsync();
      setIsPlaying(true);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const originalUri = result.assets[0].uri;
        const fileName = originalUri.split('/').pop();
        const newPath = FileSystem.cacheDirectory + fileName;
        await FileSystem.copyAsync({ from: originalUri, to: newPath });
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            image: newPath,
            avatar: 'https://i.imgur.com/3G4hKLP.png',
          },
        ]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not pick image.');
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            document: result.uri,
            documentName: result.name,
            avatar: 'https://i.imgur.com/3G4hKLP.png',
          },
        ]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not pick document.');
    }
  };

  const handleViewImage = (uri) => {
    router.push({ pathname: '/viewImage', params: { uri } });
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => confirmDeleteMessage(item.id)}
      onPress={() => handleReactToMessage(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.messageContainer}>
        <Image
          source={{ uri: 'https://i.imgur.com/3G4hKLP.png' }} // Replace with actual avatar if needed
          style={styles.avatar}
        />
        <View style={styles.bubble}>
          {item.text && <Text style={styles.messageText}>{item.text}</Text>}
          {item.image && (
            <TouchableOpacity onPress={() => handleViewImage(item.image)}>
              <Image source={{ uri: item.image }} style={{ width: 200, height: 200, borderRadius: 12, marginTop: 6 }} resizeMode="cover" />
            </TouchableOpacity>
          )}
          {item.document && (
            <TouchableOpacity onPress={() => Alert.alert('Open Document', item.documentName)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Ionicons name="document" size={20} color="#555" />
              <Text style={{ marginLeft: 6, color: '#555', textDecorationLine: 'underline' }}>{item.documentName}</Text>
            </TouchableOpacity>
          )}
          {item.audio && (
            <TouchableOpacity
              onPress={async (e) => {
                e.stopPropagation();
                if (playingUri === item.audio && isPlaying) {
                  await playAudio(item.audio); // pause
                } else if (playingUri === item.audio && !isPlaying) {
                  await resumeAudio();
                } else {
                  await playAudio(item.audio);
                }
              }}
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
            >
              <Ionicons name={playingUri === item.audio && isPlaying ? "pause" : "play"} size={20} color="green" />
              <Text style={{ marginLeft: 6, color: 'green' }}>{playingUri === item.audio && isPlaying ? 'Pause' : 'Play Audio'}</Text>
            </TouchableOpacity>
          )}
          {Array.isArray(item.reactions) && item.reactions.length > 0 && (
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              {Object.entries(item.reactions.reduce((acc, emoji) => {
                acc[emoji] = (acc[emoji] || 0) + 1;
                return acc;
              }, {})).map(([emoji, count], idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                  <Text style={{ fontSize: 16 }}>{emoji}</Text>
                  {count > 1 && <Text style={{ fontSize: 12, marginLeft: 2 }}>{count}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.headerProfile}>
              <Image
                source={{ uri: 'https://i.imgur.com/3G4hKLP.png' }}
                style={styles.headerAvatar}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.title}>User Name</Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Ionicons name="call" size={22} color="green" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }}>
                <Ionicons name="videocam" size={22} color="green" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setShowGamesModal(true)}>
                <FontAwesome name="gamepad" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={styles.footer}>
            {input.length === 0 && (
              <TouchableOpacity onPress={handlePickImage} style={{ marginRight: 6 }}>
                <Ionicons name="image" size={24} color="black" />
              </TouchableOpacity>
            )}
            {input.length === 0 && (
              <TouchableOpacity onPress={handlePickDocument} style={{ marginRight: 6 }}>
                <Ionicons name="document" size={24} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={{ marginRight: 6 }}>
              <FontAwesome name="gamepad" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Message"
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {recording && (
                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 2 }}>
                  {`${Math.floor(recordingDuration / 60).toString().padStart(2, '0')}:${(recordingDuration % 60).toString().padStart(2, '0')}`}
                </Text>
              )}
              <TouchableOpacity
                style={[styles.micButton, recording && { transform: [{ scale: 1.3 }], backgroundColor: '#ffeaea' }]}
                onPressIn={handleMicPressIn}
                onPressOut={handleMicPressOut}
                activeOpacity={0.7}
              >
                <Ionicons name="mic" size={24} color={recording ? "red" : "black"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Emoji Picker Modal */}
      <Modal
        visible={emojiModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmojiModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: 120, position: 'relative' }}>
            <TouchableOpacity
              onPress={() => setEmojiModalVisible(false)}
              style={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }}
            >
              <Text style={{ fontSize: 32, color: '#888' }}>×</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {emojiList.map((emoji, idx) => (
                <Pressable key={idx} onPress={() => setReaction(selectedMessageId, emoji)}>
                  <Text style={{ fontSize: 36, marginHorizontal: 8 }}>{emoji}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <GamesModal visible={showGamesModal} onClose={() => setShowGamesModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-between',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  bubble: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    fontSize: 15,
  },
  sendButton: {
    padding: 6,
  },
  micButton: {
    padding: 6,
    marginRight: 4,
  },
});
