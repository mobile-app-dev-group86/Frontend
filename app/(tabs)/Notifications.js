import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'mention',
      content: 'mentioned you in Gaming Hub',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
      user: {
        username: 'janedoe',
        avatar: '', // leave empty to test initials
        status: 'online',
      },
      channelId: '101',
    },
    {
      id: '2',
      type: 'friend_request',
      content: 'sent you a friend request',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      user: {
        username: 'mikesmith',
        avatar: '',
        status: 'idle',
      },
    },
    {
      id: '3',
      type: 'reaction',
      content: 'reacted to your message',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      user: {
        username: 'sarahparker',
        avatar: '',
        status: 'offline',
      },
      channelId: '202',
    },
  ]);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case 'mention':
      case 'reaction':
        console.log(`Go to channel ${notification.channelId}`);
        break;
      case 'friend_request':
        console.log('Go to profile');
        break;
      default:
        console.log('Notification clicked');
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const renderAvatar = (user, size = 40) => {
    const initials = user.username
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const statusColors = {
      online: 'green',
      idle: 'orange',
      dnd: 'red',
      offline: 'gray',
    };

    return (
      <View style={{ position: 'relative', marginRight: 10 }}>
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#aaa',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{initials}</Text>
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: statusColors[user.status] || 'transparent',
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.notification}
              onPress={() => handleNotificationClick(item)}
            >
              {renderAvatar(item.user)}
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.username}>{item.user.username}</Text>
                  <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                </View>
                <Text style={styles.message}>{item.content}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyText}>When you get notifications, they’ll show up here.</Text>
        </View>
      )}
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 50,
  },
  clearButton: {
    fontSize: 14,
    color: 'green',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
