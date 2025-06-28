import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

const { height } = Dimensions.get('window');

const TemplateScreen2 = () => {
  const router = useRouter();
  const [serverName, setServerName] = useState('');
  const [image, setImage] = useState(null);
  const [isPickingImage, setIsPickingImage] = useState(false);

  const pickImage = async () => {
    setIsPickingImage(true);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Denied',
          'Please allow access to your photo library in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    } finally {
      setIsPickingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Back Arrow */}
          <View style={styles.backArrow}>
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.push('/template');
                }
              }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Create Your Server</Text>
          <Text style={styles.subTitle}>
            Your server is where you and your friends hang out.{"\n"}Make yours and start talking
          </Text>

          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} disabled={isPickingImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadImage} />
            ) : (
              <>
                <Ionicons name="camera" size={32} color="#000" />
                <Text style={styles.uploadText}>{isPickingImage ? 'Loading...' : 'UPLOAD'}</Text>
                <View style={styles.plusIcon}>
                  <Ionicons name="add-circle" size={24} color="#1d7036" />
                </View>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Server Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={serverName}
              onChangeText={setServerName}
              style={styles.input}
              placeholder="Enter server name"
              placeholderTextColor="#ccc"
            />
            {serverName?.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setServerName('')}>
                <Ionicons name="close-circle" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.agreement}>
            By creating a server, you agree to Chatterly's{' '}
            <Text style={styles.link} onPress={() => console.log('Open Guidelines')}>
              Community Guidelines.
            </Text>
          </Text>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Server</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: height * 0.08,
    paddingHorizontal: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 100,
    borderRadius: 20,
    borderColor: '#000',
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 30,
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  uploadText: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  label: {
    marginTop: 30,
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1d7036',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  clearButton: {
    padding: 4,
  },
  agreement: {
    fontSize: 12,
    color: '#000',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  link: {
    color: '#1d7036',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#1d7036',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TemplateScreen2;