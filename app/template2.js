import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const TemplateScreen2 = () => {
  const router = useRouter();
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setIsPickingImage(true);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open gallery.');
    } finally {
      setIsPickingImage(false);
    }
  };

  const createCustomServer = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const formData = new FormData();
      formData.append('name', serverName);
      formData.append('description', serverDescription || `${serverName} Server`);
      formData.append('category', 'OTHER');
      formData.append('isPublic', 'true');
      formData.append('memberLimit', '500');
      formData.append('verificationLevel', '0');

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'server-image.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch('http://10.40.32.147:8080/api/servers/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create server');
      }

  
      router.push('/home');
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/template')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Create Your Server</Text>
          <Text style={styles.subTitle}>Make yours and start talking</Text>

          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} disabled={isPickingImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.uploadImage} />
            ) : (
              <>
                <Ionicons name="camera" size={32} color="#000" />
                <Text style={styles.uploadText}>{isPickingImage ? 'Loading...' : 'UPLOAD'}</Text>
                <Ionicons name="add-circle" size={24} color="#1d7036" style={styles.plusIcon} />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Server Name</Text>
          <TextInput
            value={serverName}
            onChangeText={setServerName}
            style={styles.input}
            placeholder="Enter server name"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Server Description</Text>
          <TextInput
            value={serverDescription}
            onChangeText={setServerDescription}
            style={styles.input}
            placeholder="Enter server description"
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.createButton} onPress={createCustomServer} disabled={loading}>
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Server'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', marginTop: 40 },
  subTitle: { fontSize: 16, textAlign: 'center', color: '#000', marginBottom: 20 },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 30,
    position: 'relative',
  },
  uploadImage: { width: '100%', height: '100%', borderRadius: 20 },
  uploadText: { fontSize: 14, color: '#000', marginTop: 5 },
  plusIcon: { position: 'absolute', bottom: -5, right: -5 },
  label: { marginTop: 20, fontWeight: '500', fontSize: 14, color: '#000' },
  input: {
    backgroundColor: '#F5FFFA',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  createButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TemplateScreen2;
