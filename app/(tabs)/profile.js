import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DiscordProfile = () => {
  const [profileImage, setProfileImage] = useState('https://i.imgur.com/5b6Q9ZT.jpg');
  const [note, setNote] = useState('Only visible to you - click to edit');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(note);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to change your profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const startNoteEdit = () => {
    setTempNote(note);
    setIsEditingNote(true);
  };

  const saveNote = () => {
    setNote(tempNote);
    setIsEditingNote(false);
  };

  const handleCall = () => {
    Alert.alert('Call initiated', 'Starting voice call with Anna-Phina');
  };

  const handleVideoCall = () => {
    Alert.alert('Video call initiated', 'Starting video call with Anna-Phina');
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Opening chat with Anna-Phina');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Banner */}
        <View style={styles.banner} />
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
            <View style={styles.statusIndicator} />
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={14} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>Anna-Phina</Text>
            <Text style={styles.profileTag}>#62642</Text>
          </View>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.iconButton} onPress={handleMessage}>
              <MaterialIcons name="message" size={24} color="#b9bbbe" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
              <FontAwesome name="phone" size={24} color="#b9bbbe" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleVideoCall}>
              <Ionicons name="videocam" size={24} color="#b9bbbe" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Profile Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>ABOUT ME</Text>
          <Text style={styles.bioText}>
            Digital artist | Cat lover | Coffee addict
          </Text>
          
          <View style={styles.detailRow}>
            <Feather name="calendar" size={18} color="#b9bbbe" />
            <Text style={styles.detailText}>Member since May 10, 2025</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="people" size={18} color="#b9bbbe" />
            <Text style={styles.detailText}>1 mutual friend</Text>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Note Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>NOTE</Text>
          {isEditingNote ? (
            <View>
              <TextInput
                style={styles.noteInput}
                value={tempNote}
                onChangeText={setTempNote}
                autoFocus
                multiline
              />
              <View style={styles.noteActions}>
                <TouchableOpacity onPress={saveNote} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsEditingNote(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={startNoteEdit}>
              <Text style={styles.noteText}>{note}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (keep all previous styles from earlier example)
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#202225',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2f3136',
  },
  noteInput: {
    backgroundColor: '#40444b',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    minHeight: 80,
    marginBottom: 8,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#5865f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b9bbbe',
  },
  cancelButtonText: {
    color: '#b9bbbe',
  },
});

export default DiscordProfile;