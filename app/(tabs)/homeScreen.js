import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

import homeimage from '../../assets/images/homeimage.png';
import gamepad from '../../assets/images/gamepad.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.circle1}>
          <Image
            source={gamepad}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/createServer')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <FontAwesome6 name="add" size={24} color="#000000" />
            </View>
            {pathname === '/createServer' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/hub')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <FontAwesome5 name="network-wired" size={24} color="#000000" />
            </View>
            {pathname === '/network' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/messageScreen')}>
          <View style={styles.iconContainer}>
            <View style={styles.circle}>
              <Feather name="message-circle" size={24} color="#000000" />
            </View>
            {pathname === '/messageScreen' && <View style={styles.activeLine} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Area */}
      <View style={styles.mainArea}>
        <Text style={{ fontSize: 40 }}>Servers</Text>

        <Image
          source={homeimage}
          style={{
            width: 200,
            height: 200,
            marginTop: 20,
            marginLeft: 20,
            paddingLeft: 10,
          }}
        />

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 25, color: '#2C2C2C', textAlign: 'center' }}>
            {'Ready For a \nnext-level group \nchat?'}
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Join a server</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1}>
          <Text style={styles.buttonText1}>Create a server</Text>
        </TouchableOpacity>
      </View>

      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 70,
    backgroundColor: '#50C878',
    alignItems: 'center',
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
  },
  activeLine: {
    height: 4,
    width: 30,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 2,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#50C878',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainArea: {
    flex: 1,
    marginLeft: 70,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    height: 55,
    width: 200,
    justifyContent: 'center',
  },
  button1: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    height: 55,
    width: 200,
    borderColor: 'green',
    borderWidth: 2,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonText1: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
