import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ViewImage() {
  const router = useRouter();
  const { uri } = useGlobalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log('ViewImage URI:', uri ? decodeURIComponent(uri) : 'No URI'); // Debug log

  if (!uri) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No image provided</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={30} color="green" />
      </TouchableOpacity>
      {loading && !error && <ActivityIndicator size="large" color="#00ff00" />}
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load image</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {!error && (
        <Image
          source={{ uri }}
          style={[styles.image, { flex: 1 }]}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
            console.warn("Error loading image:", uri);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#7aff58',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});