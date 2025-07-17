import React, { useState } from "react"; // Import useState
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Assuming you are using Expo for icons

// --- Define your 'SecurityScreen' and 'StandingScreen' components here ---
// These will be the content displayed when a tab is active.
const SecurityScreenContent = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>Security settings go here!</Text>
    {/* Add your Security-specific UI elements */}
    <View style={styles.addEmailContainer}>
      <Text style={styles.addEmailText}>Add an email to your account</Text>
      <TouchableOpacity style={styles.addEmailButton}>
        <Text style={styles.addEmailButtonText}>Add Email</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.sectionTitle}>Account Information</Text>
    <View style={styles.accountInfoContainer}>
      <AccountInfoRow label="Username" value="3541043637" />
      <AccountInfoRow label="Display Name" value="Dean" />
      <AccountInfoRow label="Email" value="" showArrow={true} />
      <AccountInfoRow label="Phone" value="+23356783468" />
    </View>

    <Text style={styles.signInText}>How you sign into your account</Text>
  </View>
);

const StandingScreenContent = () => (
  <View style={styles.standingcontentContainer}>
    <View style={styles.circle}></View>
    <Text style={styles.contentText}>Your account is all good</Text>
  </View>
);

// --- Your existing AccountInfoRow component ---
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
  // Use useState to manage the active tab
  const [activeTab, setActiveTab] = useState("security"); // 'security' or 'standing'

  const renderContent = () => {
    if (activeTab === "security") {
      return <SecurityScreenContent />;
    } else if (activeTab === "standing") {
      return <StandingScreenContent />;
    }
    return null; // Should not happen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
      </View>

      {/* Security and Standing Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "security" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("security")}
        >
          <Text
            style={
              activeTab === "security" ? styles.activeTabText : styles.tabText
            }
          >
            Security
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "standing" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("standing")}
        >
          <Text
            style={
              activeTab === "standing" ? styles.activeTabText : styles.tabText
            }
          >
            Standing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render content based on activeTab */}
      {renderContent()}
    </View>
  );
};

// --- Your existing styles, with additions for new content containers ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Red background for the main container
    paddingTop: 50, // Adjust for status bar
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#90EE90", // Light grey background for the tab area
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 3,
    marginBottom: 20,
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
    color: "#666",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addEmailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addEmailText: {
    fontSize: 16,
    color: "#333",
  },
  addEmailButton: {
    backgroundColor: "#8aff5a", // Green button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addEmailButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  accountInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden", // Ensures borders are contained
  },
  accountInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin line
    borderBottomColor: "#e0e0e0", // Light grey for separators
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
    color: "black", // Light grey for section title
    marginHorizontal: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  // New styles for content containers
  contentContainer: {
    flex: 1, // Allow content to take up remaining space
    paddingHorizontal: 0, // Padding handled by internal components
  },
  standingcontentContainer: {
    flex: 1, // Allow content to take up remaining space
    paddingHorizontal: 0, // Padding handled by internal components
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginVertical: 20,
  },
  circle: {
    width: 100, // Diameter of the circle
    height: 100, // Diameter of the circle
    borderRadius: 50, // Half of width/height makes it a circle
    justifyContent: "center", // Center content vertically inside the circle
    alignItems: "center", // Center content horizontally inside the circle
    marginBottom: 10, // Space between circle and text
    borderWidth: 2,
    borderColor: "black",
  },
});

export default AccountScreen;