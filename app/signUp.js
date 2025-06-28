
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import facebookLogo from '../assets/images/facebook.png';
import googleLogo from '../assets/images/google.png';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setUserEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirm] = useState(false);
  const [checked, setChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const router = useRouter();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const mismatch = async () => {
    let valid = true;

    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters, with letters and numbers");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (!checked) {
      alert("You must agree to the Terms and Conditions");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch("http://192.168.12.248:8080/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (response.ok) {
          console.log('Signup successful:', data);
          alert("Signup successful. Please check your email for a verification code.");
          router.push({
            pathname: '/verifyCode',
            params: { email: email },
          });
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (parseError) {
        console.error("Server did not return JSON:", text);
        alert("Unexpected response from server. Please try again later.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please check your network or try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: '5%' }} />
      <Text style={styles.title}>Sign Up</Text>

      <Text>Email</Text>
      <TextInput
        style={[styles.input, emailError && { borderColor: 'red' }]}
        autoCapitalize='none'
        keyboardType='email-address'
        value={email}
        onChangeText={setUserEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text>Username</Text>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        value={userName}
        onChangeText={setUserName}
      />

      <Text>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, passwordError && { borderColor: 'red' }]}
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
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Text>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, confirmError && { borderColor: 'red' }]}
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
      {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

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

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
        <TouchableOpacity>
          <View style={styles.circle}>
            <Image source={googleLogo} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.circle}>
            <Image source={facebookLogo} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'row' }}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/loginScreen')}>
          <Text style={{ color: 'green' }}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  errorText: {
    color: 'red',
    marginBottom: 10,
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
  label: {
    flex: 1,
    flexWrap: 'wrap',
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

export default SignUp;
