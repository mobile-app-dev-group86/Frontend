import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the CallContext
const CallContext = createContext(null);

// Provider component
export const CallProvider = ({ children }) => {
  const [callStatus, setCallStatus] = useState(null);

  // Function to send call response messages
  const sendCallResponse = useCallback((responseType, callerId) => {
    console.log(`Call response sent: ${responseType} for caller ${callerId}`);
    // Here you would implement the actual WebSocket or signaling logic to send the response
    setCallStatus({ responseType, callerId });
  }, []);

  return (
    <CallContext.Provider value={{ callStatus, sendCallResponse }}>
      {children}
    </CallContext.Provider>
  );
};

// Custom hook to use the CallContext
export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
