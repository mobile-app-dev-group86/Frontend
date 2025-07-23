import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const ServerDetailsScreen = ({ serverId }) => {
  const [showTextChannels, setShowTextChannels] = useState(true);
  const [showVoiceChannels, setShowVoiceChannels] = useState(true);
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    const fetchServerDetails = async () => {
      try {
        const response = await fetch(`http://YOUR_BACKEND_URL/api/servers/${serverId}`);
        const data = await response.json();
        setServerData(data);
      } catch (error) {
        console.error("Error fetching server details:", error.message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchServerDetails();
  }, [serverId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50C878" />
      </View>
    );
  }

  // Always render layout, even if serverData is null
  const name = serverData?.name || "Server Name";
  const textChannels = serverData?.textChannels || [];
  const voiceChannels = serverData?.voiceChannels || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Server Name */}
        <TouchableOpacity
        style={styles.serverNameRow}
        onPress={() => router.push("/inviteFriend")}
>
         <Text style={styles.serverNameText}>{name}</Text>
         <Ionicons name="chevron-forward-outline" size={18} color="#000" />
         </TouchableOpacity>
        {/* Search Pill */}
        <TouchableOpacity
          style={styles.searchPill}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search-outline" size={18} color="#555" />
          <Text style={styles.searchPillText}>Search</Text>
        </TouchableOpacity>

        {/* Action Icons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => router.push({ pathname: '/addFriends', params: { serverInvite: serverData?.inviteLink || `https://yourapp.com/invite/${serverId}` } })}>
            <Ionicons name="person-add-outline" size={24} color="green" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/CalendarScreen")}>
            <Ionicons name="calendar-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>

        {/* Text Channels */}
        <TouchableOpacity
          style={styles.channelHeader}
          onPress={() => setShowTextChannels(!showTextChannels)}
        >
          <Ionicons
            name={
              showTextChannels
                ? "chevron-down-outline"
                : "chevron-forward-outline"
            }
            size={16}
            color="#000"
          />
          <Text style={styles.channelHeaderText}>Text Channels</Text>
        </TouchableOpacity>
        {showTextChannels &&
          (textChannels.length > 0 ? (
            textChannels.map((channel) => (
              <TouchableOpacity key={channel.id} style={styles.channelItem}>
                <Ionicons name="chatbox-outline" size={18} color="#000" />
                <Text style={styles.channelName}>{channel.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No text channels available</Text>
          ))}

        {/* Voice Channels */}
        <TouchableOpacity
          style={styles.channelHeader}
          onPress={() => setShowVoiceChannels(!showVoiceChannels)}
        >
          <Ionicons
            name={
              showVoiceChannels
                ? "chevron-down-outline"
                : "chevron-forward-outline"
            }
            size={16}
            color="#000"
          />
          <Text style={styles.channelHeaderText}>Voice Channels</Text>
        </TouchableOpacity>
        {showVoiceChannels &&
          (voiceChannels.length > 0 ? (
            voiceChannels.map((channel) => (
              <TouchableOpacity key={channel.id} style={styles.channelItem}>
                <Ionicons name="mic-outline" size={18} color="#000" />
                <Text style={styles.channelName}>{channel.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No voice channels available</Text>
          ))}
      </ScrollView>
    </View>
  );
};

export default ServerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  content: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  serverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  serverNameText: {
    fontSize: 22,
    fontWeight: "600",
    marginRight: 6,
    color: "#000",
  },
  searchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  searchPillText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 16,
  },
  channelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  channelHeaderText: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
    color: "#000",
  },
  channelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 8,
    gap: 10,
  },
  channelName: {
    fontSize: 14,
    color: "#333",
  },
  emptyText: {
    paddingLeft: 8,
    color: "#999",
    fontStyle: "italic",
    fontSize: 13,
  },
});
