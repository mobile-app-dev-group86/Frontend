import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
{/* <Ionicons name="notifications" size={24} color="black" /> */}

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
      
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
         ios: {
            
            position: 'absolute',
            backgroundColor: 'lightgreen', 
          },
          default: {
            backgroundColor: 'lightgreen', 
          },
        }),
      }}>
        <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color="black;" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color="black" />,
        }}
      />
    
      
    </Tabs>
  );
}
