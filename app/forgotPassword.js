import react, {useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,Pressable} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

const forgotPassword =()=>{
    const [userName, setUserName] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);

      return(
        <View>

    <View style={styles.circle}><Feather name="arrow-left" size={24} color="black" /></View>
  
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

passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    padding: 12,
    paddingRight: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
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

  circle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  borderWidth: 0.5,               
  borderColor: '#333',     
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




})

