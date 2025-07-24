import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import Ionicons from '@expo/vector-icons/Ionicons';

const shareOptions = [
  {
    icon: "copy-outline",
    label: "Copy Link",
    action: async () => {
      await Clipboard.setStringAsync("https://your-invite-link.com");
      Alert.alert("Copied", "Invite link copied to clipboard.");
    },
  },
  {
    icon: "chatbubble-outline",
    label: "Messages",
    color:"green",
    url: "sms:",
  },
  {
    icon: "mail-outline",
    label: "Email",
    url: "mailto:",
  },
  {
    icon: "paper-plane-outline",
    label: "Telegram",
    url: "https://t.me/",
  },
  {
    icon: "logo-twitter",
    label: "Twitter",
    url: "https://twitter.com/",
  },
  {
    icon: "logo-whatsapp",
    label: "WhatsApp",
    url: "whatsapp://send?text=Join+my+server",
  },
];

export default function InviteFriendScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("https://your-backend-api.com/api/friends"); // Replace with real backend URL
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.log("Failed to load friends", err);
      }
    };

    fetchFriends();
  }, []);

  const handleShare = (option) => {
    if (option.action) {
      option.action();
    } else if (option.url) {
      Linking.openURL(option.url).catch(() =>
        Alert.alert("Error", "Unable to open this option")
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* New pill buttons */}
      <TouchableOpacity style={styles.pillButtonGreen} onPress={() => router.push('/Notifications')}>
        <Text style={styles.pillButtonGreenText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pillButtonNeutral} onPress={() => router.push('/createChannel')}>
        <Text style={styles.pillButtonNeutralText}>Create Channel</Text>
      </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite a Friend</Text>
      </View>

      {/* Share options */}
      <View >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.shareScroll}
        contentContainerStyle={styles.shareContainer}
      >
        {shareOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.shareButton}
            onPress={() => handleShare(option)}
          >
            <Ionicons name={option.icon} size={24} color="black" />
            <Text style={styles.shareLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="black" />
        <TextInput
          placeholder="Invite your friend to a new server"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.expiryText}>
        Your invite link expires within 7 days
      </Text>

      {/* Friends List */}
      <ScrollView contentContainerStyle={styles.friendsList}>
        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendItem}>
            <View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendUsername}>@{friend.username}</Text>
            </View>
            <TouchableOpacity style={styles.inviteBtn}>
              <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 50,
    flex: 1, // Ensures background extends all the way down
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  shareScroll: {
    marginBottom: 12,
    
  },
  shareContainer: {
    gap: 8,
  },
  shareButton: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 80,
  },
  shareLabel: {
    fontSize: 12,
    color: "black",
    marginTop: 4,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    marginLeft: 8,
    color: "black",
    flex: 1,
  },
  expiryText: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 12,
  },
  friendsList: {
    paddingBottom: 40, // Extra space to scroll comfortably
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  friendName: {
    fontWeight: "bold",
    color: "#000",
  },
  friendUsername: {
    fontSize: 12,
    color: "#555",
  },
  inviteBtn: {
    backgroundColor: "#1f873e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  inviteText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    gap: 12,
  },
  notificationsButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  notificationsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createChannelButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  createChannelButtonText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pillButtonGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'green',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    width: '100%',
    marginTop: 10,
  },
  pillButtonGreenText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pillButtonNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  pillButtonNeutralText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pillArrow: {
    marginLeft: 10,
  },
});
