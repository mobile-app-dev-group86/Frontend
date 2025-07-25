import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';


const GAMES = [
  {
    id: '1',
    title: 'City Stunt 2',
    url: 'https://html5.gamedistribution.com/c69d483b0eee4a1d8ce0b411a33e59bc/',
    image: require('../assets/images/citystaunt2.png'), 
  },
  {
    id: '2',
    title: 'Drunken Boxing',
    url: 'https://www.twoplayergames.org/game/drunken-boxing',
    image: require('../assets/images/drunkenboxing.png'), 
  },
  {
    id: '3',
    title: 'Fireboy & Watergirl',
    url: 'https://www.coolmathgames.com/0-fireboy-and-water-girl-in-the-forest-temple',
    image: require('../assets/images/fireandwater.png'),
  },
  {
    id: '4',
    title: 'Geometry Vibes',
    url: 'https://www.twoplayergames.org/game/geometry-vibes',
    image: require('../assets/images/geometryvibes.png'), 
  },
  {
    id: '5',
    title: 'Get on Top',
    url: 'https://poki.com/en/g/get-on-top',
    image: require('../assets/images/getontop.png'), 
  },
  {
    id: '6',
    title: 'Hero Transform',
    url: 'https://www.twoplayergames.org/game/hero-transform-race',
    image: require('../assets/images/herotransform.png'),
  },
  {
    id: '7',
    title: 'Ludo Online',
    url: 'https://www.silvergames.com/en/ludo',
    image: require('../assets/images/ludoonline.png'), 
  },
  {
    id: '8',
    title: 'Master Chess',
    url: 'https://poki.com/en/g/master-chess',
    image: require('../assets/images/masterchess.png'), 
  },
  {
    id: '9',
    title: 'Stick Duel Battle',
    url: 'https://www.twoplayergames.org/game/stick-duel-battle',
    image: require('../assets/images/stickwar.png'), 
  },
  {
    id: '10',
    title: 'Moto X3M 2',
    url: 'https://www.coolmathgames.com/0-moto-x3m-2',
    image: require('../assets/images/obbyonabike.png'), 
  },
  {
    id: '11',
    title: 'Snowball.io',
    url: 'https://poki.com/en/g/snowball-io',
    image: require('../assets/images/showrush.png'), 
  },
  {
    id: '12',
    title: 'Night City Racing ',
    url: 'https://www.crazygames.com/game/city-car-stunt-4',
    image: require('../assets/images/nightcityracing.png'), 
  },
];

const GamesModal = ({ visible, onClose }) => {
  const router = useRouter();

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={styles.gameBox}
      activeOpacity={0.7}
      onPress={() => {
        router.push({ pathname: '/GameWebView', params: { gameUrl: item.url, title: item.title } });
        onClose(); // Close modal after selection
      }}
    >
      <Image source={item.image} style={styles.gameImage} resizeMode="cover" />
      <Text style={styles.gameBoxText} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <View style={styles.headingRow}>
            <Ionicons name="game-controller-outline" size={32} color="green" style={styles.gamepadIcon} />
            <Text style={styles.headingText}>Games</Text>
          </View>

          <FlatList
            data={GAMES}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            renderItem={renderGame}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  gamepadIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 8,
  },
  headingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
  },
  grid: {
    alignItems: 'center',
  },
  gameBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    width: 120,
    height: 110,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  gameBoxText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  gameImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
});

export default GamesModal;
