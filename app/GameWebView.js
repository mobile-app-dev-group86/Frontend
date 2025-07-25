// GameWebView.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useLocalSearchParams, useRouter } from 'expo-router';

const GameWebView = () => {
  const { gameUrl, title } = useLocalSearchParams();
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <WebView source={{ uri: gameUrl }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameWebView;
