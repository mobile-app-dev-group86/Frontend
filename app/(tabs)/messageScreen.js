
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import gamepad from '../../assets/images/gamepad.jpg';

const screenWidth = Dimensions.get('window').width;

export default function MessageScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://your-api-url.com/messages');
        const data = await response.json();
        setMessages(data || []);
      } catch (error) {
        console.warn('Failed to fetch messages:', error);
        setMessages([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const renderNoMessages = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/images/messageimage.png')}
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={styles.noMessagesTitle}>DMs with superpowers</Text>
      <Text style={styles.noMessagesText}>
        Invite your friends to play games, listen to music together, and more.
      </Text>
       <TouchableOpacity
       style={styles.addButton}
      onPress={() => router.push("addFriends")} >
     <Text style={styles.addButtonText}>Add Friends</Text>
    </TouchableOpacity>
    </View>
  );

  const renderMessages = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      {messages.map((msg) => (
        <TouchableOpacity key={msg.id} style={styles.messageItem}>
          <Image
            source={
              msg.profileImage
                ? { uri: msg.profileImage }
                : require('../../assets/images/default-avatar.jpeg')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{msg.name}</Text>
            <Text style={styles.lastMessage}>{msg.lastMessage}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.circle1}>
          <Image
            source={gamepad}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/createServer')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <FontAwesome6 name="add" size={24} color="#000000" />
            </View>
            {pathname === '/createServer' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/hub')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <FontAwesome5 name="network-wired" size={24} color="#000000" />
            </View>
            {pathname === '/network' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/messageScreen')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <Feather name="message-circle" size={24} color="#000000" />
            </View>
            {pathname === '/messageScreen' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Message Area beside sidebar */}
      <KeyboardAvoidingView
        style={styles.mainArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color="#777" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor="#777"
          />
          <TouchableOpacity style={styles.addFriendButton} onPress={() => router.push("addFriends")}>
            <Ionicons name="person-add" size={20} color="#000" />
            <Text style={styles.addFriendText}>Add Friends</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {!loading && messages.length === 0
            ? renderNoMessages()
            : renderMessages()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
  },
  sidebar: {
    width: 70,
    backgroundColor: '#50C878',
    alignItems: 'center',
    paddingTop: 40,
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFriendText: {
    marginLeft: 5,
    fontWeight: '500',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  illustration: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 20,
  },
  noMessagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noMessagesText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#555',
    fontSize: 14,
  },
  iconContainer: {
    alignItems: 'center',
  },
  activeLine: {
    height: 4,
    width: 30,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 2,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#50C878',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
