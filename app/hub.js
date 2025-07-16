import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 

import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function StudentHubScreen() {
    const router = useRouter(); 
  const [emailAddress, setEmailAddress] = useState('');

  const handleJoinHub = () => {
    if (emailAddress.trim()) {
      console.log('Joining hub with email:', emailAddress);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            <View style={styles.backArrow}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      </View>
          
          <View style={styles.imageContainer}>
            <Image
           source={require('../assets/images/hubimage.png')}
           style={styles.heroImage}
           resizeMode="contain"
/>

          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Find study groups, clubs, and friends in the Student Hub for your school!
            </Text>

            <Text style={styles.description}>
              Meet classmates from your school, discover communities, and share your services, all in one place.{' '}
              <Text style={styles.learnMore}>Learn more.</Text>
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Official School Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="name@school.edu"
                placeholderTextColor="#9ca3af"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Privacy & Legal */}
            <Text style={styles.privacyText}>
              Review Chatterly's{' '}
              <Text style={styles.linkText}>Terms of Service</Text>{' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>{' '}
              to learn more about how we use your data.
            </Text>

            {/* Join Button */}
            <TouchableOpacity
              style={[
                styles.joinButton,
                !emailAddress.trim() && styles.joinButtonDisabled
              ]}
              onPress={handleJoinHub}
              disabled={!emailAddress.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>Join Hub</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 80,
  },
  imageContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroImage: {
    width: '100%',
    height: 200,
    maxWidth: 300,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  learnMore: {
    color: 'green',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  privacyText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  linkText: {
    color: 'green',
    textDecorationLine: 'underline',
  },
  joinButton: {
    backgroundColor: 'green',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 20,
      zIndex: 10,}
});
