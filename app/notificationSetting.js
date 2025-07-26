import { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, View,TouchableOpacity } from 'react-native';

// Mock backend fetch simulation
const fetchNotificationsFromAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', title: 'Direct Messages', enabled: true },
                { id: '2', title: 'Mentions', enabled: false },
                { id: '3', title: 'Server Notifications', enabled: true },
                { id: '4', title: 'Friend Requests', enabled: false },
            ]);
        }, 1500); // simulate delay
    });
};
const router = useRouter();

const NotificationItem = ({ title, isEnabled, onToggle }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{title}</Text>
        <Switch
            trackColor={{ false: '#767577', true: 'green' }}
            thumbColor={isEnabled ? 'green' : '#f4f3f4'}
            onValueChange={onToggle}
            value={isEnabled}
        />
    </View>
);

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotificationsFromAPI().then(data => {
            setNotifications(data);
            setLoading(false);
        });
    }, []);

    const handleToggle = (id) => {
        setNotifications(prev =>
            prev.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
        // Here you'd also make a PATCH request to backend
        // await updateNotificationPreference(id, newStatus)
    };

    const renderItem = ({ item }) => (
        <NotificationItem
            title={item.title}
            isEnabled={item.enabled}
            onToggle={() => handleToggle(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Notification Settings</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : notifications.length === 0 ? (
                <Text style={styles.noActivity}>No activity</Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    noActivity: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default NotificationsScreen;
