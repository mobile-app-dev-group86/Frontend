import { useRouter } from 'expo-router'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

const templates = [
  { id: "1", name: "Gaming", icon: "gamepad-variant", route: "/template" },
  { id: "2", name: "School Club", icon: "school", route: "/template" },
  { id: "3", name: "Study Group", icon: "book", route:"/template" },
  { id: "4", name: "Friends", icon: "contacts", route:"/template" },
  { id: "5", name: "Artists & Creators", icon: "music", route: "/template" },
  { id: "6", name: "Local Community", icon: "handshake", route: "/template" },
];

export default function CreateYourServerScreen() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  const createServer = async (type, name) => {
    try {
      setLoading(true);
      const response = await fetch('https://your-backend.com/api/servers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, name }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to create server');
      
      // Navigate to the created server
      router.push(`/server/${data.serverId}`);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => createServer('template', item.name)}
    >
      <View style={styles.leftSide}>
        <MaterialCommunityIcons name={item.icon} size={24} color="black" />
        <Text style={styles.templateText}>{item.name}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backArrow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Create Your Server</Text>
      <Text style={styles.subtitle}>
        Your server is where you and your friends hang out. Make yours and start talking
      </Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => createServer('custom', 'My Custom Server')}
        disabled={loading}
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#ffffff" />
        <Text style={styles.createButtonText}>Create My Own</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Start from a template</Text>
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <TouchableOpacity 
        style={styles.joinButton} 
        onPress={() => router.push('/joinHub')}
      >
        <Text style={styles.joinButtonText}>Join a Server</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    marginBottom: 30,
  },
  createButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  list: {
    marginBottom: 30,
  },
  joinButton: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "green",
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  joinButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"
  },
  templateItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 5,
    justifyContent: "space-between",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  templateText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
});
