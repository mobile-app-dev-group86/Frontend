import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const VoiceSettingScreen = () => {
    const router = useRouter();
    const [volume, setVolume] = useState(50);
    const [pitch, setPitch] = useState(1);
    const [speed, setSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => setIsMuted(previousState => !previousState);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Voice Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.setting}>
                <Text style={styles.settingText}>Volume: {isMuted ? 'Muted' : `${volume}%`}</Text>
                <Slider
                    style={styles.slider}
                    value={isMuted ? 0 : volume}
                    onValueChange={setVolume}
                    disabled={isMuted}
                    minimumValue={0}
                    maximumValue={100}
                />
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Mute</Text>
                    <Switch
                        value={isMuted}
                        onValueChange={toggleMute}
                    />
                </View>
            </View>

            <View style={styles.setting}>
                <Text style={styles.settingText}>Pitch: {pitch}</Text>
                <Slider
                    style={styles.slider}
                    value={pitch}
                    onValueChange={setPitch}
                    minimumValue={0.5}
                    maximumValue={2}
                    step={0.1}
                />
            </View>

            <View style={styles.setting}>
                <Text style={styles.settingText}>Speed: {speed}</Text>
                <Slider
                    style={styles.slider}
                    value={speed}
                    onValueChange={setSpeed}
                    minimumValue={0.5}
                    maximumValue={2}
                    step={0.1}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    setting: {
        marginBottom: 30,
        backgroundColor: '#50C878',
        padding: 20,
        borderRadius: 12,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
});

export default VoiceSettingScreen;

