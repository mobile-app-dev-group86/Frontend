import React from "react";
import { View, Text, StyleSheet, ScrollView ,TouchableOpacity} from "react-native";

const profileScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Profile Content - Now with green background */}n
      <View style={styles.profileSection}>
        {/* Your existing profile components */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <Text style={styles.username}>Royaldean</Text>
          <Text style={styles.userInfo}>4398374537 • She/Her</Text>
        </View>

        {/* Status Button */}
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusText}>+ Add Status</Text>
        </TouchableOpacity>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <Text style={styles.optionText}>Amp up your profile</Text>
          </View>
          <View style={styles.optionItem}>
            <Text style={styles.optionText}>Get Nitro</Text>
          </View>
          <View style={styles.optionItem}>
            <Text style={styles.optionText}>Shop</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2e8b57", // Main green background
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  profileSection: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    marginBottom: 15,
  },
  username: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  statusButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  statusText: {
    color: "#2e8b57",
    fontWeight: "bold",
    textAlign: "center",
  },
  optionsContainer: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 15,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});

export default profileScreen;