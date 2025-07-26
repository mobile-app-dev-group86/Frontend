import { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
const ActivityScreen = () => {
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Simulate fetching data from backend
    useEffect(() => {
        fetchActivityData();
    }, []);

    const fetchActivityData = async () => {
        try {
            // Replace this with your backend API call
            // Example: const response = await fetch('https://yourapi.com/activities');
            // const data = await response.json();

            const data = [
                { id: '1', title: 'Playing Chess', user: 'User1' },
                { id: '2', title: 'Watching a Movie', user: 'User2' },
                { id: '3', title: 'Listening to Music', user: 'User3' },
            ];
    

            setActivityData(data);
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderActivityItem = ({ item }) => (
        <TouchableOpacity style={styles.activityItem}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityUser}>{item.user}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            <Text style={styles.header}>Activity Feed</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#7289DA" />
            ) : activityData.length === 0 ? (
                <Text style={styles.noActivityText}>No activity</Text>
            ) : (
                <FlatList
                    data={activityData}
                    renderItem={renderActivityItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 24,
        color: '#000000',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    activityItem: {
        backgroundColor: '#50C878',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    activityTitle: {
        fontSize: 18,
        color: '#000000',
        marginBottom: 4,
    },
    activityUser: {
        fontSize: 14,
        color: '#000000',
    },
    noActivityText: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default ActivityScreen;
