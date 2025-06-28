
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

// export { default } from '../(tabs)/_layout';

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      {/* Green background at the top */}
      <View style={styles.topGreen} />

      {/* Middle work area */}
      <View style={styles.middleContainer}>
        <View style={styles.verticalGreenBar} />
        <View style={styles.workArea} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3BAF5D',
  },
  topGreen: {
    height: height * 0.15,
    backgroundColor: '#3BAF5D',
  },
  middleContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    right: 0,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalGreenBar: {
    width: 20,
    height: '90%',
    backgroundColor: '#3BAF5D',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginRight: -10,
    zIndex: 2,
  },
  workArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    marginHorizontal: 20,
    borderRadius: 40,
    height: '100%',
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
});

export default MessageScreen;
