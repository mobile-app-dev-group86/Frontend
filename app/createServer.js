import { useRouter } from 'expo-router'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';

// template items and icons
const templates = [
  { id: "1", name: "Gaming", icon: "gamepad-variant", route: '/template' },
  { id: "2", name: "School Club", icon: "school", route: '/template' },
  { id: "3", name: "Study Group", icon: "book", route: '/template' },
  { id: "4", name: "Friends", icon: "contacts", route: '/template' },
  { id: "5", name: "Artists & Creators", icon: "music", route: '/template' },
  { id: "6", name: "Local Community", icon: "handshake", route: '/template' },
];

export default function CreateYourServerScreen() {
  const router = useRouter(); 

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => {
        if (item.route) {
          router.push(item.route);
        } 
      }}
    >
      <View style={styles.leftSide}>
        <MaterialCommunityIcons name={item.icon} size={24} color=" " />
        <Text style={styles.templateText}>{item.name}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color=" " />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Server</Text>
      <Text style={styles.subtitle}>
        Your server is where you and your friends hang out. Make yours and start talking
      </Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/createChannel')}
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#ffffff" />
        <Text style={styles.createButtonText}>Create My Own</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Start from a template</Text>
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}> Join a Server</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    title: {
        fontSize: 26,
        color: "#000000",
        fontWeight: "bold",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        color: "#000000",
        marginBottom: 20,
    },

    createButton: {
        flexDirection: "row",
        alignItems: " center",
        backgroundColor: "green",
        padding: 14,
        borderRadius: 25,
        justifyContent: "center",
        marginBottom: 30,
    },

    createButtonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold",
        display:"row"
    },

    sectionHeader: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 10,
    },

    list: {
        marginBottom: 30,
    },

    joinButton: {
        flexDirection: "row",
        alignSelf: " center",
        backgroundColor: "1d7036",
        padding: 14,
        borderRadius: 25,
        justifyContent: "center",
        backgroundColor: "green",
        marginHorizontal: 20,
        marginBottom: 20,
    },

    joinButtonText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold"
    },

    templateItem: {
        flexDirection: "row",
        alignItems: " center",
        
        padding: 12,
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginBottom: 5,
        justifyContent: "space-between",
        
        
        backgroundColor:"#e0e0e0",
        borderRadius: 10,
    },

    templateText: {
        fontSize: 16,
        color: " ",
        marginLeft: 12,
    },

    leftSide: {
        flexDirection: "row",
        alignItems: "center",
    },
});