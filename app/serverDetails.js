import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const groupChannels = {
  text: [
    { id: '1', name: '#general' },
    { id: '2', name: '#Clips and Highlights' }
  ],
  voice: [
    { id: '3', name: 'Lobby', icon: 'mic-outline' },
    { id: '4', name: 'Gaming', icon: 'mic-outline' }
  ]
};

const ServerDetailsScreen = () => {
  const renderChannel = (title, channels) => (
    <View key={title} style={styles.groups}>
      <Text style={styles.groupTitle}>
        {title.charAt(0).toUpperCase() + title.slice(1)} Channels
      </Text>
      {channels.map(channel => (
        <TouchableOpacity key={channel.id} style={styles.channelRow}>
          <Ionicons name={channel.icon || "chatbox-outline"} size={20} color="#000" />
          <Text style={styles.channelText}>
            {channel.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.sidebarButton}>
          <Ionicons name="server-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <Ionicons name="person-circle-outline" size={50} color="#000" style={styles.profileIcon} />
        <Text style={styles.title}>Zephyr's Server</Text>
        
        {/* Render Channels */}
        {renderChannel('text', groupChannels.text)}
        {renderChannel('voice', groupChannels.voice)}
      </View>
    </View>
  );
};

export default ServerDetailsScreen;
