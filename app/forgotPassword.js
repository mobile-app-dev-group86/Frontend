import { useRouter } from 'expo-router';

import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Image, Pressable,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

const forgotPassword =()=>{
      const router=useRouter();

      const[userName,setUserName]=useState('');
    const[password,setPassword]=useState('');

    const [showPassword, setShowPassword] = useState(false);
    const[confirmPassword,setConfirmPassword]=useState('');
    const [showConfirmPassword, setShowConfirm] = useState(false);

      return(
        <View style={styles.container}>
<Pressable onPress={()=>router.back()}>
  <View style={styles.ring} ><Feather name="arrow-left" size={24} color="black" /></View>
  </Pressable>
    <View style={styles.psdTitle}><Text style={styles.title}>Create New Password</Text></View>
  
  

  <Text>Username</Text>
              <TextInput
              style={styles.input}
              autoCapitalize='none'
              keyboardType='text'
              value={userName}
              onChangeText={setUserName}
              />
   
             <Text>Password</Text>
            <View style={styles.passwordContainer}>           
              <TextInput
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize='none'
              />
  
             <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Image
            source={
              showPassword
                ? require('../assets/images/view.png') 
                : require('../assets/images/hide.png')     
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
        </View>
  
  
       
  
              
  
              <Text>Confirm Password</Text>
              <View style={styles.passwordContainer}>
              <TextInput
              style={styles.passwordInput}
              autoCapitalize='none'
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              />
  
               <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <Image
            source={
              showConfirmPassword
                ? require('../assets/images/view.png') 
                : require('../assets/images/hide.png')     
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>

        <View style={{alignItems:'center',justifyContent:'center',marginTop:10, flexDirection:'row'}}>
                  <Link href="/codeVerification" style={{color:'green'}}><Text> verify code</Text></Link>
                  </View>

          
          
        
  
              </View>
  








              <View>

              <TouchableOpacity style={styles.button}>
                              <Text style={styles.buttonText}>Reset Password</Text>
              
                          </TouchableOpacity>
     </View>
        </View>
      )


}

const styles=StyleSheet.create({


  container: {
    flex: 1,
    padding: 24,
    justifyContent: '',
    backgroundColor: '#fff'},

passwordContainer: {
    position: 'relative',
    marginBottom: 15,

  },
  passwordInput: {
    padding: 12,
    paddingRight: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '30%',
  },
  eyeIcon: {
    width: 24,
    height: 24,
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

 button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 50,
    textAlign: 'center',
  },
  psdTitle:{

  },
  input:{
    padding: 12,
    paddingRight: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    fontSize: 16,
     

  }






});

export default forgotPassword;

