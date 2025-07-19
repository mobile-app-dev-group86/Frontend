import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const templates = [
  { id: "1", name: "Gaming", icon: "gamepad-variant", route: "/template" },
  { id: "2", name: "School Club", icon: "school", route: "/template" },
  { id: "3", name: "Study Group", icon: "book", route: "/template" },
  { id: "4", name: "Friends", icon: "contacts", route: "/template" },
  { id: "5", name: "Artists & Creators", icon: "music", route: "/template" },
  { id: "6", name: "Local Community", icon: "handshake", route: "/template" },
];

export default function CreateYourServerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinServerLink, setJoinServerLink] = useState('');

  const handleTemplatePress = async (template) => {
    try {
      await AsyncStorage.setItem('selectedTemplate', template.name);
      router.push(template.route);
    } catch (err) {
      console.error("Failed to store template:", err);
    }
  };

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => handleTemplatePress(item)}
    >
      <View style={styles.leftSide}>
        <MaterialCommunityIcons name={item.icon} size={24} color="black" />
        <Text style={styles.templateText}>{item.name}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  );

  const handleJoinPress = () => {
    Alert.alert("Server Not Found", `Server with link "${joinServerLink}" does not exist.`);
    setJoinServerLink('');
    setShowJoinModal(false);
  };

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
        onPress={() => router.push('/template2')}
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
        onPress={() => setShowJoinModal(true)}
      >
        <Text style={styles.joinButtonText}>Join a Server</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showJoinModal}
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Join via Link</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter server invite link"
              value={joinServerLink}
              onChangeText={setJoinServerLink}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.modalJoinBtn} onPress={handleJoinPress}>
              <Text style={styles.modalJoinText}>Join</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalHubBtn} onPress={() => {
              setShowJoinModal(false);
              router.push('/hub');
            }}>
              <Text style={styles.modalHubText}>Join Hub</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowJoinModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
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
    padding: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: "#000"
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 15,
    color: "#000",
  },
  modalJoinBtn: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  modalJoinText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalHubBtn: {
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  modalHubText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalCancel: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
