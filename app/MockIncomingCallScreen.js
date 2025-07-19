import React, { useState } from 'react';
import IncomingCallScreen from './IncomingCallScreen';

export default function MockIncomingCallScreen() {
  const [visible, setVisible] = useState(true);
  const [caller, setCaller] = useState({
    id: '12345',
    name: 'John Doe',
    profileImage: 'https://via.placeholder.com/150',
  });

  const handleAccept = () => {
    console.log('Call accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    console.log('Call declined');
    setVisible(false);
  };

  return (
    <IncomingCallScreen
      visible={visible}
      caller={caller}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
}
