import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Devices = ({ navigation }) => {
    const goToAccount = () => {
        navigation.navigate('Account');
    };
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>
                Devices
            </Text>

            <Text style={styles.firstParagraph}>
                Here are all the devices that are currently logged in
                with your Chatterly account. You can log out of each
                one individually or all other devices. {"\n\n"}
                If you see an entry you don't recognize, log out of that
                device and change your Chatterly account password immediately.
            </Text>

            <Text style={styles.currentDevice}>
                Current Device
            </Text>
            <View style={styles.devicesCard}>
                <Ionicons name="phone-portrait-outline" size={20} color="#ffffff" />
                <View style={styles.devicesMessage}>
                    <Text style={styles.firstline}>
                        Android. Discord Android
                    </Text>
                    <Text style={styles.secondline}>
                        Kumasi, Ashanti Region, Ghana
                    </Text>
                </View>
            </View>

            <Text style={styles.currentDevice}>
                Other Devices
            </Text>
            <View style={styles.devicesCard}>
                <Ionicons name="alert-circle-outline" size={20} color="#ffffff" />
                <View style={styles.devicesMessage}>
                    <Text style={styles.firstline}>
                        Some older devices may not be shown here
                    </Text>
                    <Text style={styles.secondline} onPress={goToAccount}>
                        To log them out, please {' '}
                        <Text style={styles.link}>
                            change your password
                        </Text>
                    </Text>
                </View>
            </View>

        </View>
    );
};

export default Devices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        paddingTop: 40,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12
    },
    firstParagraph: {
        fontSize: 14,
        color: '#000',
        marginBottom: 20,
        lineHeight: 20
    },
    currentDevice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10
    },
    devicesCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: 'green',
        borderRadius: 8,
        marginBottom: 10
    },
    devicesMessage: {
        marginLeft: 10,
        flex: 1
    },
    firstline: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000'
    },
    secondline: {
        fontSize: 12,
        color: '#111',
        marginTop: 4
    },
    link: {
        color: '#1d7a55',
        textDecorationLine: 'underline'
    },
});
