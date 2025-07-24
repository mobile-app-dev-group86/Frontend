import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const GamesModal = ({ visible, onClose, games = [] }) => {
  // Prepare data: if no games, show 6 placeholders
  const data = games.length > 0 ? games : Array.from({ length: 6 }, (_, i) => ({ id: i.toString(), name: 'Game', placeholder: true }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {/* Heading */}
          <View style={styles.headingRow}>
            <Ionicons name="game-controller-outline" size={32} color="green" style={styles.gamepadIcon} />
            <Text style={styles.headingText}>Games</Text>
          </View>
          {/* Grid of games */}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.gameBox} activeOpacity={0.7}>
                {/* Game image from API goes here */}
                {item.image ? (
                  <Image
                    source={{ uri: item.image }} // <-- API image path here
                    style={styles.gameImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <Text style={styles.gameBoxText}>{item.placeholder ? 'Game' : item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  gamepadIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 8,
  },
  headingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
  },
  grid: {
    alignItems: 'center',
  },
  gameBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    width: 120,
    height: 90,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  gameBoxText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  gameImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
});

export default GamesModal; 