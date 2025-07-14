
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import gamepad from '../../assets/images/gamepad.jpg';
import { useRouter, usePathname } from 'expo-router';

const { width, height } = Dimensions.get('window');

const MessageScreen = () => {
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

        <TouchableOpacity onPress={() => router.push('/network')}>
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

      {/* Main chat area */}
      <View style={styles.mainArea}>
        {/* Add chat UI here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#50C878',
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
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
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
  activeLine: {
    height: 4,
    width: 30,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 2,
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
    borderTopLeftRadius: 50,
    padding: 20,
    marginTop: 20,
    borderBottomLeftRadius: 0,
  },
});

export default MessageScreen;