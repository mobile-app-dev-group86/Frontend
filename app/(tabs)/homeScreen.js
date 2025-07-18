import { useRouter, usePathname } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

import homeimage from '../../assets/images/homeimage.png';
import gamepad from '../../assets/images/gamepad.jpg';

import ServerDetailsScreen from '../serverDetails';

const getRandomColor = () => {
  const colors = ['#FF8A80', '#FFD180', '#A7FFEB', '#80D8FF', '#B388FF', '#F48FB1'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  const fetchServers = async () => {
    try {
      const response = await fetch('http://YOUR_BACKEND_URL/api/servers'); // Replace with your real URL
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  // Refresh servers when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchServers();
    }, [])
  );

  const handleServerPress = (server) => {
    setSelectedServer(server);
  };

  const renderServerCircle = ({ item }) => (
    <TouchableOpacity
      style={styles.serverCircleWrapper}
      onPress={() => handleServerPress(item)}
    >
      <View style={[styles.serverCircle, { backgroundColor: getRandomColor() }]}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.serverImage} />
        ) : (
          <Text style={styles.serverInitial}>{item.name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Fixed Top: Logo + Icons */}
        <View style={styles.fixedTop}>
          <View style={styles.circle1}>
            <Image source={gamepad} style={{ width: 50, height: 50, borderRadius: 25 }} />
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
              {pathname === '/hub' && <View style={styles.activeLine} />}
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

          {/* Divider */}
          <View style={styles.divider} />
        </View>

        {/* Scrollable Server List */}
        <FlatList
          data={servers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderServerCircle}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          style={styles.scrollArea}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainArea}>
        {selectedServer ? (
          <ServerDetailsScreen serverId={selectedServer.id} />
        ) : (
          <>
            <Text style={{ fontSize: 40 }}>Servers</Text>
            <Image source={homeimage} style={{ width: 200, height: 200, marginTop: 20 }} />
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
          </>
        )}
      </View>

      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
  },
  sidebar: {
    width: 70,
    backgroundColor: '#50C878',
    alignItems: 'center',
  },
  fixedTop: {
    paddingTop: 40,
    alignItems: 'center',
  },
  scrollArea: {
    flexGrow: 1,
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
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: 40,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
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
  serverCircleWrapper: {
    marginBottom: 10,
  },
  serverCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  serverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
