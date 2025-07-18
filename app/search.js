import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching:", query);
    // Make backend API call here
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={20} color="green" />
        <TextInput
          style={styles.input}
          placeholder="Search for people or channels"
          placeholderTextColor="green"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fdfdfd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    color: "green",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    borderRadius: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
});
