import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TokenWallet() {
  const router = useRouter();

  // Example placeholder for user data (replace with real API call or context)
  const [user, setUser] = useState({
    tokenBalance: 1250.50,
    tokenActivity: [],
    username: "JohnDoe",
    avatar: null,
  });

  // Leaderboard data - replace with actual API call
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API calls
      // const userData = await leaderboardService.getUserTokenData(userId);
      // const leaderboardData = await leaderboardService.getLeaderboardData(userId);
      
      // setUser(userData.user);
      // setLeaderboardData(leaderboardData.leaderboard);
      
      // For now, set empty data until API is ready
      setUser({
        tokenBalance: 0,
        tokenActivity: [],
        username: "",
        avatar: null,
      });
      setLeaderboardData([]);
      
    } catch (error) {
      console.error('Error fetching token data:', error);
      // Set empty data on error
      setUser({
        tokenBalance: 0,
        tokenActivity: [],
        username: "",
        avatar: null,
      });
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return "#666";
    }
  };

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={[
      styles.leaderboardItem,
      item.isCurrentUser && styles.currentUserItem
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          { color: getRankColor(item.rank) }
        ]}>
          {getRankIcon(item.rank)}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.defaultAvatarText}>
                {item.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={[
            styles.username,
            item.isCurrentUser && styles.currentUserText
          ]}>
            {item.username}
            {item.isCurrentUser && " (You)"}
          </Text>
          <Text style={styles.userRank}>Rank #{item.rank}</Text>
        </View>
      </View>
      
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenAmount}>
          {item.tokenBalance.toFixed(2)}
        </Text>
        <Text style={styles.tokenLabel}>Tokens</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#50C878" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Token Wallet</Text>
      </View>

      {/* White Container */}
      <View style={styles.container}>
        {/* Token Balance */}
        <Text style={styles.sectionTitle}>Main Card - Token Balance</Text>
        <Text style={styles.subText}>Your Chat Score</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 22, marginRight: 6 }}>💰</Text>
          <Text style={styles.tokenBalance}>
            [ {user.tokenBalance?.toFixed(2) || "0.00"} Tokens ]
          </Text>
        </View>

        {/* Chat Score Leaderboard */}
        <View style={styles.leaderboardSection}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>🏆 Chat Score Leaderboard</Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={fetchData}
              disabled={isLoading}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color={isLoading ? "#ccc" : "#50C878"} 
              />
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
          ) : (
            <FlatList
              data={leaderboardData}
              renderItem={renderLeaderboardItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.leaderboardList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
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
  leaderboardSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  leaderboardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
  },
  refreshButton: {
    padding: 5,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  leaderboardList: {
    paddingBottom: 10,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: "#e8f5e8",
    borderWidth: 2,
    borderColor: "#50C878",
  },
  rankContainer: {
    width: 40,
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#50C878",
    alignItems: "center",
    justifyContent: "center",
  },
  defaultAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  currentUserText: {
    color: "#50C878",
    fontWeight: "bold",
  },
  userRank: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  tokenInfo: {
    alignItems: "flex-end",
  },
  tokenAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#50C878",
  },
  tokenLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  separator: {
    height: 8,
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
