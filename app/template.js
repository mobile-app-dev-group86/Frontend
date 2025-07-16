//<TouchableOpacity onPress={() => navigation.navigate('GamingTemplateScreen')}>
//   <TemplateCard icon="game-controller" label="Gaming" />
//</TouchableOpacity>

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 

import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const templateScreen = () => {
  
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <View style={styles.backArrow}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 90 }}>
        <Text style={styles.title}>
          Tell Us More About Your Server
        </Text>e

        <Text style={styles.subTitle}>
          In order to help you with your setup, is your
          new server for just a few friends or a larger community
        </Text>

        {/* Club or Community */}
        <TouchableOpacity
          style={styles.optionContent}
          onPress={() => router.push('/template2')} 
        >
          <View style={styles.contentBox}>
            <View style={styles.leftside}>
              <Ionicons name='person-circle-outline' size={30} color='#000' />
              <Text style={styles.contentText}>
                For a club or community
              </Text>
            </View>
            <Ionicons name='chevron-forward-outline' size={20} color='#000' />
          </View>
        </TouchableOpacity>

        {/* Me and My Friends */}
        <TouchableOpacity
          style={styles.optionContent}
          onPress={() => router.replace('/template2')} 
        >
          <View style={styles.contentBox}>
            <View style={styles.leftside}>
              <Ionicons name='person-circle-outline' size={30} color='#000' />
              <Text style={styles.contentText}>
                For me and my friends
              </Text>
            </View>
            <Ionicons name='chevron-forward-outline' size={20} color='#000' />
          </View>
        </TouchableOpacity>

        <Pressable onPress={() => console.log('Skipped')}>
          <Text style={styles.skipText}>
            Not sure? You can{' '}
            <Text style={styles.skipLink}>
              skip this question
            </Text>{' '}
            for now.
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default templateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    backArrow: {
         position: 'absolute',
        top: 50,
        left: 20,
        // zIndex: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionContent: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'green'
    },
    contentBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    leftside: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    contentText: {
        fontSize: 16,
        fontWeight: '600',
        
    },
    icon: {
        marginRight: 16
    },
    skipText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginTop: 32
    },
    skipLink: {
        color: 'green',
        fontWeight: '500'
    }
});