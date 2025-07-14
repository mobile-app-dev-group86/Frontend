
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CodeVerification = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // 👈 get email from params

  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);

  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');
  const [val4, setVal4] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e, prevInput) => {
    if (e.nativeEvent.key === 'Backspace' && prevInput) {
      prevInput.current.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = val1 + val2 + val3 + val4;

    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Please enter the full 4-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.12.248:8080/api/auth/verify-code", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Verification successful!");
        router.replace('/homeScreen');
      } else {
        Alert.alert("Invalid Code", data.message || "Please check your code and try again.");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <View style={styles.ring}>
            <Feather name="arrow-left" size={24} color="black" />
          </View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>Please Enter The Code Sent To Your Mail.</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            ref={input1}
            value={val1}
            onChangeText={(text) => {
              setVal1(text);
              if (text) input2.current.focus();
            }}
            onKeyPress={(e) => handleKeyPress(e, null)}
          />
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            ref={input2}
            value={val2}
            onChangeText={(text) => {
              setVal2(text);
              if (text) input3.current.focus();
            }}
            onKeyPress={(e) => handleKeyPress(e, input1)}
          />
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            ref={input3}
            value={val3}
            onChangeText={(text) => {
              setVal3(text);
              if (text) input4.current.focus();
            }}
            onKeyPress={(e) => handleKeyPress(e, input2)}
          />
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            ref={input4}
            value={val4}
            onChangeText={setVal4}
            onKeyPress={(e) => handleKeyPress(e, input3)}
          />
        </View>

        <Text style={styles.infoText}>Didn't Receive OTP?</Text>
        <Text style={styles.resend}>Resend Code</Text>

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CodeVerification;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  topBar: {
    alignItems: 'flex-start',
  },
  ring: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 25,
  },
  input: {
    width: 70,
    height: 70,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'green',
    textAlign: 'center',
    fontSize: 24,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  resend: {
    color: 'green',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
