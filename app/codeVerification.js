
import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const codeVerification = () => {
  const router = useRouter();
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);

  const handleKeyPress = (e, prevInput) => {
    if (e.nativeEvent.key === 'Backspace' && prevInput) {
      prevInput.current.focus();
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
          <TextInput style={styles.input} maxLength={1} keyboardType="numeric" ref={input1}
            onChangeText={text => text && input2.current.focus()}
            onKeyPress={e => handleKeyPress(e, null)} />
          <TextInput style={styles.input} maxLength={1} keyboardType="numeric" ref={input2}
            onChangeText={text => text && input3.current.focus()}
            onKeyPress={e => handleKeyPress(e, input1)} />
          <TextInput style={styles.input} maxLength={1} keyboardType="numeric" ref={input3}
            onChangeText={text => text && input4.current.focus()}
            onKeyPress={e => handleKeyPress(e, input2)} />
          <TextInput style={styles.input} maxLength={1} keyboardType="numeric" ref={input4}
            onChangeText={() => {}}
            onKeyPress={e => handleKeyPress(e, input3)} />
        </View>

        
        <Text style={styles.infoText}>Didn't Receive OTP?</Text>
        <Text style={styles.resend}>Resend Code</Text>

        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        
        
      </View>
    </View>
  );
};
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


export default codeVerification;
