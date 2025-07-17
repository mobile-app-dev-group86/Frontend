import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // For back navigation

export default function TokenWallet() {
  const navigation = useNavigation();

  // Example placeholder for user data (replace with real API call or context)
  const [user, setUser] = useState({
    tokenBalance: 0, // default 0
    tokenActivity: [], // empty by default
  });

  useEffect(() => {
    // Simulate fetching from backend
    const fetchUserData = async () => {
      // Replace this with actual API call
      
      setUser(fakeUser);
    };

    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#50C878" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Token Wallet</Text>
      </View>

      {/* White Container */}
      <View style={styles.container}>
        {/* Token Balance */}
        <Text style={styles.sectionTitle}>Main Card - Token Balance</Text>
        <Text style={styles.subText}>Your Token Balance</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 22, marginRight: 6 }}>💰</Text>
          <Text style={styles.tokenBalance}>
            [ {user.tokenBalance?.toFixed(2) || "0.00"} Tokens ]
          </Text>
        </View>

        {/* Activity Summary */}
        <Text style={styles.summaryTitle}>Token Activity Summary</Text>

        <ScrollView style={{ flexGrow: 0 }}>
          {user.tokenActivity.length === 0 ? (
            <Text style={{ color: "#666", fontStyle: "italic" }}>
              No token activity yet.
            </Text>
          ) : (
            user.tokenActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="triangle"
                    size={22}
                    color="yellow"
                    style={{
                      transform: [
                        { rotate: activity.type === "redeem" ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={
                      activity.type === "redeem"
                        ? styles.redeemedText
                        : styles.earnedText
                    }
                  >
                    {activity.type === "redeem"
                      ? `Redeemed ${activity.amount} Tokens`
                      : `Earned ${activity.amount} Tokens`}
                  </Text>
                  <Text style={styles.dateText}>{activity.date}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Redeem Button */}
        <TouchableOpacity style={styles.redeemBtn}>
          <Text style={styles.redeemBtnText}>Redeem Token</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#B2FF6A",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#222",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
    color: "#222",
  },
  subText: {
    color: "#666",
    fontSize: 15,
    marginBottom: 5,
  },
  tokenBalance: {
    color: "#43a047",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  summaryTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 20,
    color: "#222",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  bullet: {
    fontSize: 22,
    color: "#222",
    marginRight: 6,
    marginTop: -2,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#388e3c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  earnedText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  redeemedText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  dateText: {
    color: "#444",
    fontSize: 14,
    marginTop: 1,
  },
  redeemBtn: {
    backgroundColor: "green",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  redeemBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
