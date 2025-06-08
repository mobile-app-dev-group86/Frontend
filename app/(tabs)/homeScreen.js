import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
{/* <FontAwesome6 name="add" size={24} color="black" /> */}
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
{/* <FontAwesome5 name="network-wired" size={24} color="black" /> */}
import Feather from '@expo/vector-icons/Feather';
{/* <Feather name="message-circle" size={24} color="black" /> */}
// import AntDesign from '@expo/vector-icons/AntDesign';
// {/* <AntDesign name="search1" size={24} color="black" /> */}
// import AntDesign from '@expo/vector-icons/AntDesign';
// {/* <AntDesign name="adduser" size={24} color="black" /> */}
import FontAwesome from '@expo/vector-icons/FontAwesome';
// {/* <FontAwesome name="home" size={24} color="black" /> */}
 import Ionicons from '@expo/vector-icons/Ionicons';
// {/* <Ionicons name="notifications" size={24} color="black" /> */}
import homeimage from '../../assets/images/homeimage.png';
import gamepad from '../../assets/images/gamepad.jpg';



// import React from 'react';
import { View, StyleSheet, SafeAreaView,Text,Image,TouchableOpacity } from 'react-native';

export default function homeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.sidebar}>
        
        <View style={styles.circle1} >  <Image
                  
                   source={gamepad} 
                   style={{ width: 50, height: 50, borderRadius: 25. }}
    resizeMode="cover"
                   
                  
                /></View>
        <View style={styles.circle} ><FontAwesome6 name="add" size={24} color="#009E60" /></View>
        <View style={styles.circle} ><FontAwesome5 name="network-wired" size={24} color="#009E60" /></View>
        <View style={styles.circle} > <Feather name="message-circle" size={24} color="#009E60" /></View>
      </View>

      <View style={styles.mainArea}>
      <Text style={{fontSize:40}}>Servers</Text>


 <Image
                  
                   source={homeimage} 
                   style={{ width: 250, height: 300,marginTop: 20,marginLeft: 20,paddingLeft:10,  }}       
                  
                  
                />
                <View style={{alignItems: 'center', justifyContent: 'center',}}>
                <Text style={{fontSize:30}}>Ready For a {'\n'}
                 next-level group {'\n'}
                  chat?</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  
                >
                  <Text style={styles.buttonText}>Join a server</Text>
                </TouchableOpacity>

               <TouchableOpacity
                  style={styles.button1}
                  
                >
                  <Text style={styles.buttonText1}>Create a server</Text>
                </TouchableOpacity>



      </View>


    
      

      
      
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  sidebar: {
    flex:1,
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
     marginLeft: 70, // leaves space for sidebar
    marginBottom: 0, // leaves space for bottom bar
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 15,
   },
  // bottomBar: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   height: 85,
  //   backgroundColor: '#90ee90',
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   alignItems: 'center',

    tabItem: {
  justifyContent: 'center',
  alignItems: 'center',
},
tabText: {
  fontSize: 12,
  color: 'black',
  marginTop: 4,
  
},
// bottomBar: {
//   position: 'absolute',
//   left: 0,
//   right: 0,
//   bottom: 0,
//   height: 70,
//   backgroundColor: '#d0f0c0', 
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   alignItems: 'center',
// },
button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 20,
      marginTop: 12,
      height:60,
      width:300,
    },
button1: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
      marginTop: 12,
      height:60,
      width:300,
      borderColor: 'green',
      borderWidth: 2,
    },



       buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:30,
  },


buttonText1: {
    color: 'green',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize:30,}

  
});




