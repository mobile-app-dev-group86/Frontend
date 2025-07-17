import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';

const userData = {
  username: 'user-name',
  joinedDate: 'May 10, 2025',
};

const STATUS_OPTIONS = [
  { label: 'Online', color: '#3ba55c' },
  { label: 'Idle', color: '#faa61a' },
  { label: 'Do Not Disturb', color: '#ed4245' },
  { label: 'Invisible', color: '#747f8d' },
];

const DiscordProfile = () => {
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access gallery is required!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleStatusSelect = (item) => {
    setStatus(item);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.banner}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => router.push('/settings')}
        >
          <Feather name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : { uri: 'https://i.imgur.com/5b6Q9ZT.jpg' }
              }
              style={styles.avatar}
            />
            <View
              style={[styles.statusIndicator, { backgroundColor: status.color }]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.statusToggle}>
          <AntDesign name="caretdown" size={16} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.nameSection}>
        <Text style={styles.profileName}>{userData.username}</Text>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Status Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <FlatList
              data={STATUS_OPTIONS}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect(item)}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.statusText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Feather name="calendar" size={18} color="black" />
          <Text style={styles.detailText}>Member since {userData.joinedDate}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.friendsRow}>
          <View style={styles.detailRow}>
            <MaterialIcons name="people" size={18} color="black" />
            <Text style={styles.detailText}>Friends</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/friendsScreen')}>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.friendsRow}>
          <View style={styles.detailRow}>
            <MaterialIcons name="money" size={18} color="gold" />
            <Text style={styles.detailText}>Tokens</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/Token')}>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DiscordProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  banner: {
    height: 130,
    backgroundColor: '#B0E0E6',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingRight: 16,
  },
  settingsIcon: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -40,
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ccc',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  statusToggle: {
    padding: 4,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 2,
    marginLeft: 6,
    marginTop: 16,
  },
  nameSection: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  profileName: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  editText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  friendsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    color: '#333',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#2f3136',
    padding: 12,
    borderRadius: 10,
    width: 200,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
  },
});
