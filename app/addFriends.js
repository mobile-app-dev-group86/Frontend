import React from "react";
import { useRouter } from 'expo-router'; 

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Share,
  Linking,
  Alert,
  Platform,
} from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";



export default function AddFriendsScreen() {
  const navigation = useNavigation();
  const router = useRouter(); 

  const inviteMessage = "Hey! Add me on Chatterly using this link: https://yourapp.com/invite";

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(inviteMessage);
    Alert.alert("Copied", "Link copied to clipboard");
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: inviteMessage });
    } catch (error) {
      Alert.alert("Share failed", error.message);
    }
  };

  const handleOpenSMS = () => {
    const url = Platform.select({
      ios: `sms:&body=${encodeURIComponent(inviteMessage)}`,
      android: `sms:?body=${encodeURIComponent(inviteMessage)}`,
    });
    Linking.openURL(url);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:?subject=Join me on Discord&body=${encodeURIComponent(inviteMessage)}`);
  };

  const handleLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Friends</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Share Options */}
      <View style={styles.iconRow}>
        <View style={styles.iconGroup}>
          <FontAwesome5 name="discord" size={24} color="#5865F2" />
          <Text style={styles.iconLabel}>Discord</Text>
        </View>
        <TouchableOpacity onPress={handleShare}>
          <View style={styles.iconGroup}>
            <Ionicons name="share-social" size={24} color="black" />
            <Text style={styles.iconLabel}>Share</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCopyLink}>
          <View style={styles.iconGroup}>
            <Feather name="link" size={24} color="black" />
            <Text style={styles.iconLabel}>Copy</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenSMS}>
          <View style={styles.iconGroup}>
            <Ionicons name="chatbox" size={24} color="#1E88E5" />
            <Text style={styles.iconLabel}>Messages</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmail}>
          <View style={styles.iconGroup}>
            <MaterialIcons name="email" size={24} color="#D93025" />
            <Text style={styles.iconLabel}>Email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLink("https://telegram.org/")}>
          <View style={styles.iconGroup}>
            <FontAwesome5 name="telegram" size={24} color="#0088cc" />
            <Text style={styles.iconLabel}>Telegram</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLink("https://twitter.com/")}>
          <View style={styles.iconGroup}>
            <Entypo name="twitter" size={24} color="#1DA1F2" />
            <Text style={styles.iconLabel}>Twitter</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLink("https://wa.me/?text=" + encodeURIComponent(inviteMessage))}>
          <View style={styles.iconGroup}>
            <FontAwesome name="whatsapp" size={24} color="green" />
            <Text style={styles.iconLabel}>WhatsApp</Text>
          </View>
        </TouchableOpacity>
      </View>

    
    <View style={styles.usernameRow}>
  <Text style={styles.atSign}>@</Text>
  <Text style={styles.usernameText}>Add username</Text>
  <View style={{ flex: 1 }} /> {/* pushes the arrow to the far right */}
  <TouchableOpacity onPress={() => router.push("/sendfriendrequest")}>
    <AntDesign name="right" size={20} color="black" />
  </TouchableOpacity>
</View>
      <View style={styles.imageBox}>
        <Image
          source={require("../assets/images/messageimage.png")} 
          style={styles.image}
        />
        <TouchableOpacity style={styles.findBtn}>
          <Text style={styles.findBtnText}>Find Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  iconGroup: {
    alignItems: "center",
    width: 70,
    marginBottom: 20,
  },
  iconLabel: {
    fontSize: 12,
    color: "black",
    marginTop: 4,
    textAlign: "center",
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
    height: 45,
  },
  atSign: {
    fontSize: 18,
    color: "black",
    marginRight: 6,
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  imageBox: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 280,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  findBtn: {
    backgroundColor: "green",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  findBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
