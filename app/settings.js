import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            router.replace("/loginScreen"); 
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const settingsData = [
    {
      key: "1",
      label: "My Account",
      onPress: () => router.push("/Account"),
    },
    {
      key: "2",
      label: "Devices",
      onPress: () => router.push("/devices"),
    },
    
    {
      key: "3",
      label: "Chat settings",
      onPress: () => router.push("/ChatSetting"),
    },
    {
      key: "4",
      label: "Privacy and safety",
      onPress: () => router.push("/DataPrivacy"),
    },
    // {
    //   key: "5",
    //   label: "Connections",
    //   onPress: () => router.push("/settings"),
    // },
    // {
    //   key: "6",
    //   label: "Accessibility",
    //   onPress: () => router.push("/settings/accessibility"),
    // },
    {
      key: "5",
      label: "Voice settings",
      onPress: () => router.push("/VoiceSetting"),
    },
    {
      key: "6",
      label: "Activity feed",
      onPress: () => router.push("/ActivityScreen"),
    },
    {
      key: "7",
      label: "Notification settings",
      onPress: () => router.push("/notificationSetting"),
    },
    {
      key: "8",
      label: "Log Out",
      isLogout: true,
      onPress: handleLogout,
    },
  ];

  const filteredSettings = settingsData.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderSetting = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        item.isLogout && {
          borderColor: "#ff4d4d",
          backgroundColor: "#fff5f5",
        },
      ]}
      onPress={item.onPress}
    >
      <Text
        style={[
          styles.settingText,
          item.isLogout && { color: "#ff4d4d", fontWeight: "600" },
        ]}
      >
        {item.label}
      </Text>
      {item.isLogout ? (
        <Feather name="log-out" size={18} color="#ff4d4d" />
      ) : (
        <AntDesign name="right" size={16} color="black" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Search settings..."
          placeholderTextColor="#444"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredSettings}
        keyExtractor={(item) => item.key}
        renderItem={renderSetting}
        contentContainerStyle={styles.settingsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2ea",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  settingsList: {
    paddingBottom: 40,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderColor: "#c6eac9",
    borderWidth: 1,
  },
  settingText: {
    fontSize: 16,
    color: "black",
  },
  separator: {
    height: 15,
  },
});