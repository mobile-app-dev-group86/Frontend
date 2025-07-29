import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="homeScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        
        tabBarStyle: Platform.select({
          ios: {
    position: 'absolute',
    backgroundColor: '#72FF85',
    borderTopWidth: 0,
    shadowColor: 'transparent',
  },
  android: {
    backgroundColor: '#72FF85',
    elevation: 0,
    borderTopWidth: 0,
    
  },
        }),
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="messageScreen"
  options={{
                   
    tabBarButton: () => null,  
    tabBarItemStyle: { display: 'none' }    
  }}
/>

    </Tabs>
  );
}
