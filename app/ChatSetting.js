import React, { useState } from 'react';
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatSsettingScreen = ({ navigation }) => {
  const goToAccount = () => {
    navigation.navigate('Account');
  };
  const router = useRouter();

  const [postlinks, setPostLinks] = useState(true);
  const [uploadDirectly, setUploadDirectly] = useState(true);
  const [imageDescription, setImageDescription] = useState(false);
  const [saveDevice, setSaveDevice] = useState(true);
  const [dataSaving, setDataSaving] = useState(false);
  const [selected, setSelected] = useState('best');

  const togglepostlinks = () => setPostLinks(prev => !prev);
  const toggleUploadDirectly = () => setUploadDirectly(prev => !prev);
  const toggleImageDescription = () => setImageDescription(prev => !prev);
  const toggleSaveDevice = () => setSaveDevice(prev => !prev);
  const toggleDataSaving = () => setDataSaving(prev => !prev);

  return (
    <SafeAreaView >
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Chat Settings</Text>

      {/* Display images and videos */}
      <Text style={styles.sectionHeader}>Display images and videos</Text>
      <View style={styles.cardSettings}>
        <TouchableOpacity>
          <Switch value={postlinks} onValueChange={togglepostlinks} />
        </TouchableOpacity>
        <Text style={styles.label}>When posted as links to chat</Text>

        <TouchableOpacity>
          <Switch value={uploadDirectly} onValueChange={toggleUploadDirectly} />
        </TouchableOpacity>
        <Text style={styles.label}>When uploaded directly to Chatterly</Text>

        <TouchableOpacity>
          <Switch value={imageDescription} onValueChange={toggleImageDescription} />
        </TouchableOpacity>
        <Text style={styles.label}>With image descriptions</Text>
      </View>

      <Text style={styles.subText}>
        Image descriptions are used to describe images for screenreaders
      </Text>

      {/* Camera Uploads */}
      <Text style={styles.sectionHeader}>Camera Uploads</Text>
      <View style={styles.cardSettings}>
        <TouchableOpacity>
          <Switch value={saveDevice} onValueChange={toggleSaveDevice} />
        </TouchableOpacity>
        <Text style={styles.label}>Save device camera uploads</Text>
      </View>
      <Text style={styles.subText}>
        When this is on, images and videos you take with your device camera will be uploaded to Chatterly.
      </Text>

      {/* Video Uploads */}
      <Text style={styles.sectionHeader}>Video Uploads</Text>
      <View style={styles.cardSettings}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setSelected('best')}
        >
          <Text style={styles.label}>Best Quality</Text>
          <View style={styles.radioOuter}>
            {selected === 'best' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setSelected('standard')}
        >
          <Text style={styles.label}>Standard Quality</Text>
          <View style={styles.radioOuter}>
            {selected === 'standard' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setSelected('saver')}
        >
          <Text style={styles.label}>Data Saver</Text>
          <View style={styles.radioOuter}>
            {selected === 'saver' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.subText}>
        Best Quality will use more data. Data Saver will upload faster and use less cellular data.
      </Text>

      {/* Data Consumption */}
      <Text style={styles.sectionHeader}>Data Consumption</Text>
      <View style={styles.cardSettings}>
        <TouchableOpacity>
          <Switch value={dataSaving} onValueChange={toggleDataSaving} />
        </TouchableOpacity>
        <Text style={styles.label}>Data Saver Mode</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default ChatSsettingScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  cardSettings: {
    backgroundColor: '#50C878',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#50C878',
    borderRadius: 10,
    marginVertical: 5,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7289DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7289DA',
  },
});
