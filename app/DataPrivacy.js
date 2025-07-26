import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Switch,ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

// SettingsItem component
const SettingsItem = ({ label, value, onToggle, description }) => (
    <View style={styles.settingsItem}>
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
            />
        </View>
        <Text style={styles.description}>{description}</Text>
    </View>
);

const DataPrivacy = () => {
    const router = useRouter();
    
    const goToAccount = () => {
        router.push('/Account');
    };

    const [improveDiscord, setImproveChatterly] = useState(false);
    const [personalizedExperience, setPersonalizedExperience] = useState(false);
    const [inGameRewards, setInGameRewards] = useState(false);
    const [voicePrivacy, setVoicePrivacy] = useState(false);

    // keys for AsyncStorage
    const storageKeys = {
        improve: 'uesDataToImprove',
        personalize: 'personalizedExperience',
        rewards: 'inGameRewards',
        voice: 'voicePrivacy'
    };

    // load values on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const improveValue = await AsyncStorage.getItem(storageKeys.improve);
                const personalizeValue = await AsyncStorage.getItem(storageKeys.personalize);
                const rewardsValue = await AsyncStorage.getItem(storageKeys.rewards);
                const voiceValue = await AsyncStorage.getItem(storageKeys.voice);

                if (improveValue !== null) {
                    setImproveChatterly(improveValue === 'true');

                    if (personalizeValue !== null) {
                        setPersonalizedExperience(personalizeValue === 'true');

                        if (rewardsValue !== null) {
                            setInGameRewards(rewardsValue === 'true');
                            if (voiceValue !== null) {
                                setVoicePrivacy(voiceValue === 'true');
                            }
                        }

                    }
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);

    //handler to save the settings
    const handleToggle = async (key, value, setState) => {
        try {
            setState(value);
            await AsyncStorage.setItem(key, value.toString());
        } catch (error) {
            console.log('Saving setting error', error);
        }
    };

    return (
        <ScrollView >
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Safety</Text>
                <View style={{ width: 24 }} />
            </View>

            <SettingsItem label="Use data to improve Chatterly" value={improveDiscord} onToggle={(value) => handleToggle(storageKeys.improve, value, setImproveChatterly)} description="Allows us to use and process your information to improve services." />
            <SettingsItem label="Use data to personalize my Chatterly experience" value={personalizedExperience} onToggle={(value) => handleToggle(storageKeys.personalize, value, setPersonalizedExperience)} description="Personalizes Chatterly based on who you talk to and what games you play." />
            <SettingsItem label="In-game rewards (aka Quests)" value={inGameRewards} onToggle={(value) => handleToggle(storageKeys.rewards, value, setInGameRewards)} description="Uses your activity to show rewards and quests." />
            <SettingsItem label="Enable persistent verification codes" value={voicePrivacy} onToggle={(value) => handleToggle(storageKeys.voice, value, setVoicePrivacy)} description="Allow users to save your devices and marked them as verified. All of your calls on Chatterly are end-to-end encryted no matter what. Meaning no one can listen in on your conversations." />

            <Text style={styles.sectionHeader}>
                Request your data
            </Text>

            <View style={styles.requestBox}>
                <TouchableOpacity style={styles.rowContainer} onPress={() => {
                    // this leads o chrome
                    console.log('Request all data pressed');
                }}>
                    <Text style={styles.rowText}>
                        Request all my data
                    </Text>
                    <Ionicons name='chevron-forward-outline' size={24} color='#000' />
                </TouchableOpacity>
            </View>

            <Text style={styles.learnMore}>
                Learn more about how getting a copy of your personal data works
            </Text>

            <Text style={styles.sectionHeader}>
                Policies & disclosures
            </Text>

            <View style={styles.requestLinkBox}>
                <TouchableOpacity style={styles.rowContainer} onPress={() => {
                    // this leads o chrome
                    console.log('Request all data pressed');
                }}>
                    <Text style={styles.LinkText}>
                        Terms of Service
                    </Text>
                    <Ionicons name='chevron-forward-outline' size={24} color='#000' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContainer} onPress={() => {
                    // this leads o chrome
                    console.log('Request all data pressed');
                }}>
                    <Text style={styles.LinkText}>
                        Privacy policy
                    </Text>
                    <Ionicons name='chevron-forward-outline' size={24} color='#000' />
                </TouchableOpacity>
            </View>

            <Text style={styles.requestText}>
                We need to store and process some data in order to provide
                you the basic Chatterly service, such as your messages, what
                servers you are in, and your Direct Messages.
            </Text>
            <Text style={styles.secondline} onPress={goToAccount}>
                You can stop this by {' '}
                <Text style={styles.link}>
                    Disabling or Deleting your account
                </Text>
            </Text>

        </View>
        </ScrollView>
    )

}

export default DataPrivacy;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    settingsItem: {
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#d0d0d0',
        paddingBottom: 10
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    description: {
        fontSize: 14,
        color: 'green',
        marginTop: 5
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20
    },
    requestBox: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowText: {
        fontWeight: '600'
    },
    learnMore: {
        color: '#000',
        fontSize: 12,
        marginTop: 10

    },
    requestLinkBox: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20

    },
    LinkText: {
        padding: 15,
        borderBottomColor: '#d0d0d0',
        borderBottomWidth: 1,
    },
    requestText: {
        fontSize: 12,
        color: '#000',
        marginTop: 10,
        lineHeight: 20
    },
    secondline: {
        fontSize: 12,
        color: '#green',
        marginTop: 4
    },
    link: {
        color: '#1d7a55'
    }
})
