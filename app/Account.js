import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const AccountInfoRow = ({ label, value, showArrow = true }) => (
  <TouchableOpacity style={styles.accountInfoRow}>
    <Text style={styles.accountInfoLabel}>{label}</Text>
    <View style={styles.accountInfoValueContainer}>
      <Text style={styles.accountInfoValue}>{value}</Text>
      {showArrow && <AntDesign name="right" size={16} color="#888" />}
    </View>
  </TouchableOpacity>
);

const AccountScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("security");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://your-backend-url.com/api/user/profile");
        const data = await response.json();
        setDisplayName(data.displayName);
        setEmail(data.email);
        setProfilePicture(data.profilePicture); // Must be a valid image URL
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const SecurityScreenContent = () => (
    <View style={styles.contentContainer}>
      

      <Text style={styles.sectionTitle}>Account Information</Text>
      <View style={styles.accountInfoContainer}>
        <AccountInfoRow label="Display Name" value={displayName} showArrow={false} />
        <AccountInfoRow label="Email" value={email} showArrow={false} />
      </View>

      <Text style={styles.signInText}>How you sign into your account</Text>
    </View>
  );

  const StandingScreenContent = () => (
    <View style={styles.standingcontentContainer}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profileCircle} />
      ) : (
        <View style={styles.profileCirclePlaceholder}></View>
      )}

      <Text style={styles.goodText}>Your account is all good</Text>

      <Text style={styles.infoText}>
        Thanks for upholding Chatterly's{" "}
        <TouchableOpacity onPress={() => console.log("Terms of Service pressed")}>
          <Text style={styles.link}>Terms of Service</Text>
        </TouchableOpacity>{" "}
        and{" "}
        <TouchableOpacity onPress={() => console.log("Community Guidelines pressed")}>
          <Text style={styles.link}>Community Guidelines</Text>
        </TouchableOpacity>.
      </Text>

      <Text style={styles.infoText}>
        If you break the rules it will show up here.
      </Text>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "security") return <SecurityScreenContent />;
    if (activeTab === "standing") return <StandingScreenContent />;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "security" && styles.activeTab]}
          onPress={() => setActiveTab("security")}
        >
          <Text style={activeTab === "security" ? styles.activeTabText : styles.tabText}>
            Security
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "standing" && styles.activeTab]}
          onPress={() => setActiveTab("standing")}
        >
          <Text style={activeTab === "standing" ? styles.activeTabText : styles.tabText}>
            Standing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 12,
    padding: 5,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "green",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 16,
    color: "#000000",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  standingcontentContainer: {
    marginTop: "40%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  profileCirclePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#ccc",
  },
  goodText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
  link: {
    color: "green",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  accountInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  accountInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#000000",
  },
  accountInfoLabel: {
    fontSize: 16,
    color: "#333",
  },
  accountInfoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountInfoValue: {
    fontSize: 16,
    color: "#666",
    marginRight: 5,
  },
  signInText: {
    fontSize: 14,
    color: "black",
    marginHorizontal: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default AccountScreen;
