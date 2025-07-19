import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { DailyProvider, DailyCall } from '@daily-co/react-native-daily-js';

export default function DailyCallIntegration({ roomUrl, onCallEnd }) {
  const callRef = useRef(null);
  const [callState, setCallState] = useState('new');

  useEffect(() => {
    if (callRef.current) {
      callRef.current.join({ url: roomUrl });
      callRef.current.on('joined-meeting', () => setCallState('joined'));
      callRef.current.on('left-meeting', () => {
        setCallState('left');
        onCallEnd();
      });
      callRef.current.on('error', (err) => {
        console.error('Daily call error:', err);
      });
    }
    return () => {
      if (callRef.current) {
        callRef.current.leave();
      }
    };
  }, [roomUrl]);

  return (
    <DailyProvider callObject={callRef.current}>
      <View style={styles.container}>
        <DailyCall
          ref={callRef}
          style={styles.call}
          onLeave={() => {
            setCallState('left');
            onCallEnd();
          }}
        />
        {callState === 'joined' && (
          <Button title="End Call" onPress={() => callRef.current.leave()} />
        )}
      </View>
    </DailyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  call: {
    flex: 1,
  },
});
