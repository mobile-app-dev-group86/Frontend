import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FriendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const response = await fetch("http://192.168.137.1:8080/api/friends");
      const data = await response.json();

      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setFriends(sorted);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  const goToPrivateChat = (friend) => {
    router.push({
      pathname: "/privatechat",
      params: {
        userId: friend.id,  // adapt if your friend object uses a different key
        name: friend.name,
        avatar: friend.avatar,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Friends</Text>

        <TouchableOpacity onPress={() => router.push("addFriends")}>
          <Text style={styles.addFriends}>Add Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#666"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Friends List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
        ) : filteredFriends.length === 0 ? (
          <Text style={styles.noFriends}>You have no friends</Text>
        ) : (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <TouchableOpacity
                  style={styles.leftSide}
                  onPress={() => goToPrivateChat(item)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <Text style={styles.friendName}>{item.name}</Text>
                </TouchableOpacity>

                <View style={styles.iconsRight}>
                  <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => goToPrivateChat(item)}
                  >
                    <Ionicons name="call-outline" size={20} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => goToPrivateChat(item)}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  addFriends: {
    color: "green",
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  noFriends: {
    textAlign: "center",
    color: "black",
    marginTop: 50,
    fontSize: 16,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    color: "black",
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
