import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Avatar({ source, name, size = 40, status }) {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'green';
      case 'idle': return 'orange';
      case 'dnd': return 'red';
      case 'offline': return 'gray';
      default: return 'transparent';
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {source ? (
        <Image source={{ uri: source }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
      {status && (
        <View style={[styles.status, {
          backgroundColor: getStatusColor(status),
          width: size / 5,
          height: size / 5,
          borderRadius: size / 10,
          right: 2,
          bottom: 2,
        }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
  },
  status: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
