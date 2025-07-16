import { useRouter } from 'expo-router';
import { useState } from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import facebookLogo from "../assets/images/facebook.png";
import googleLogo from "../assets/images/google.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.137.1:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();
console.log("Login response:", data);

if (response.ok) {
  router.push("/homeScreen");
} else {
  setError(data.message || "Login failed");
}
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Login</Text>

        {error !== "" && <Text style={styles.errorText}>{error}</Text>}

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Image
              source={
                showPassword
                  ? require("../assets/images/view.png")
                  : require("../assets/images/hide.png")
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={{ color: 'green', textAlign: 'right' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={loading ? null : handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.line} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity>
            <View style={styles.circle}>
              <Image
                source={googleLogo}
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.circle}>
              <Image
                source={facebookLogo}
                style={{ width: 40, height: 40, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'row' }}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/signUp')}>
            <Text style={{ color: 'green' }}> Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.push('/homeScreen')}>
            <Text style={{ color: 'green', textAlign: 'right' }}>home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.push('/messageScreen')}>
            <Text style={{ color: 'green', textAlign: 'right' }}>messagescreen</Text>
          </TouchableOpacity>
        </View>
         <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.push('/Notifications')}>
            <Text style={{ color: 'green', textAlign: 'right' }}>notification</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#777",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#555",
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

export default LoginScreen;
