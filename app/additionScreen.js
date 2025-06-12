import {Text,View,Pressable,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function  additionScreen() {
    const router = useRouter();
    

    return(
            <View style={{backgroundColor:'white',flex:1}}>
                <Text style={{fontSize:25,fontWeight:'bold',alignContent:'center',justifyContent:'center',alignSelf:'center',marginTop:60,marginBottom:10,}}>Create your server</Text>
                  <Text style={{paddingBottom:30, alignSelf:'center', textAlign:'center' ,paddingLeft:30}}>Your server is where you and your friends hang out
                  Make yours and start talking</Text>

                  
                          <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Create my own</Text>
                            <Ionicons name="chevron-forward" size={24} color="black"/>
                          </TouchableOpacity>
                  
                <Text style={{paddingTop:10,paddingLeft:10,fontSize:24}}>Start from a template</Text>
                <FlatList>


                </FlatList>
                <View></View>


            
            </View>






    );







}

const styles= StyleSheet.create({


    button: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
    flexDirection:'row',
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})