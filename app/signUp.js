
import { useRouter } from 'expo-router';

import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import facebookLogo from '../assets/images/facebook.png';
import googleLogo from '../assets/images/google.png';

const signUp =()=>{
    const[userName,setUserName]=useState('');
    const[password,setPassword]=useState('');
    const[email,setUserEmail]=useState('');
    const router = useRouter();


    const [showPassword, setShowPassword] = useState(false);
    const[confirmPassword,setConfirmPassword]=useState('');
    const [showConfirmPassword, setShowConfirm] = useState(false);
    const [checked, setChecked] = useState(false);

    const mismatch=()=>{
        if(password!==confirmPassword){
            alert("Password mismatch");
            return;
        }
        console.log("Signing up with:",email,userName,password)
    };
    return(

     

        <View style={styles.container}>
            <View style={{height:'5%'}}></View>
    
            <Text style={styles.title}>Sign Up</Text>

           <Text>Email</Text>
            <TextInput
            style={styles.input}
            autoCapitalize='none'
            keyboardType='email-address'
            value={email}
            onChangeText={setUserEmail}
            />

           <Text>Username</Text>
            <TextInput
            style={styles.input}
            autoCapitalize='none'
            keyboardType='Default'
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

            </View>

            <View style={styles.checkboxContainer}>
      <Pressable
        onPress={() => setChecked(!checked)}
        style={[styles.checkbox, checked && styles.checked]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Text style={styles.label}>I agree to the Terms and Conditions</Text>
    </View>

           <TouchableOpacity
  style={styles.button}
  onPress={mismatch}
  disabled={!checked}
>
  <Text style={styles.buttonText}>Sign Up</Text>
</TouchableOpacity>


           
              <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.line} />

               </View>
          <View style={{alignItems: 'center',flexDirection: 'row',justifyContent: 'center',gap:20}}>
            <View style={styles.circle}> <Image source={googleLogo} style={{width:40, height:40,resizeMode:'contain'}}></Image></View>
            <View style={styles.circle}><Image source={facebookLogo} style={{width:"50", height:'50'}}></Image></View>
          </View>
        
          <View style={{alignItems:'center',justifyContent:'center',marginTop:10, flexDirection:'row'}}>
            <Text>Already have an account?</Text><TouchableOpacity onPress={() => router.push('/loginScreen')}>
            <Text style={{ color: 'green' }}> Log In</Text>
          </TouchableOpacity>
          </View>
        
       

        </View>

        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  googleButton: {
    backgroundColor: '#db4437',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  or: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#999',
  },


dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 20,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: '#ccc',
},

dividerText: {
  marginHorizontal: 10,
  color: '#999',
},

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

checkboxContainer: {
  flexDirection: 'row',     
  alignItems: 'center',     
  marginTop: 10,
  marginBottom: 20,
},

checkbox: {
  width: 24,
  height: 24,
  borderWidth: 1,
  borderColor: '#999',
  borderRadius: 4,
  marginRight: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

checked: {
  backgroundColor: 'green',  
},

checkmark: {
  color: '#fff',               
  fontWeight: 'bold',
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

});


export default signUp;
