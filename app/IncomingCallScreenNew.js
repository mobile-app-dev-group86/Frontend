import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DailyCallIntegration from './DailyCallIntegration';

export default function IncomingCallScreenNew({ visible, caller, onAccept, onDecline }) {
  const [inCall, setInCall] = useState(false);
  const [roomUrl, setRoomUrl] = useState(null);

  const startCall = () => {
    // Here you would create or get a Daily.co room URL from your backend or API
    // For demo, using a placeholder room URL
    const demoRoomUrl = 'https://your-domain.daily.co/demo-room';
    setRoomUrl(demoRoomUrl);
    setInCall(true);
    onAccept();
  };

  const endCall = () => {
    setInCall(false);
    setRoomUrl(null);
    onDecline();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {!inCall ? (
        <View style={styles.incomingCallContainer}>
          <Text>{caller?.name || 'Unknown Caller'}</Text>
          <Button title="Accept" onPress={startCall} />
          <Button title="Decline" onPress={endCall} />
        </View>
      ) : (
        <DailyCallIntegration roomUrl={roomUrl} onCallEnd={endCall} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  incomingCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
