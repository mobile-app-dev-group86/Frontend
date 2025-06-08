
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import logo from '../assets/images/chatterlylogo.jpg';

export default function WelcomeScreen() {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 200 }}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View>
        <Text style={styles.welcome}>Where conversations feel alive...</Text>
      </View>

      <View style={{ flex: 0.85 }} />

      <View
        style={[
          styles.buttonContainer,
          pressed && styles.buttonPressed,
        ]}
      >
        <Link href="/loginScreen" asChild>
          <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
          >
          

    
            
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    width: 350,
    height: 150,
  },
  welcome: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 30, 
  },
  buttonContainer: {
    backgroundColor: 'green',
    width: '70%',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 25,
    alignSelf: 'center',
    
  },
  buttonPressed: {
    backgroundColor: '#004d00', 
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});