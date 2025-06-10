import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NavigatorContext } from "expo-router/build/views/Navigator";

const CreateChannelScreen = () => {
    const [channelName, setChannelName] = useState('');
    const [relateTo, setRelatedTo] = useState('general');
    const handleCreateChannel = () => {
        // Handle channel creation logic here
        console.log(`Creating channel: ${channelNmae} related to ${relatedTo}`);
        NavigatorContext.goBack(); // NAvigate back to the previous screen
    };
    return (
        <View style={Styles.container}>
            <Text style={styles.title}>
                Create  Channel
            </Text>
            <TextInput
                style={Styles.input}
                placeholder="Channel Name"
                value={channelName}
                onChangeText={setChannelName} // Update channel name state
            />
            <Text style={styles.label}>
                Related To:
            </Text>
            <Picker
                selectedValue={relatedTo}
                onChangeText={(itemvalue) => setRelatedTo(itemvalue)}
                style={styles.picker}
            >
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Announcements" value="announcements" />
                <Picker.Item label="Events" value="events" />
                <Picker.Item lbel="Gaming" value="gaming" />
                <Picker.Item label="Voice Chat" value="voice_chat" />
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleCreateChannel}>
                <Text style={styles.buttonText}>
                    Create Channel
                </Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontsize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    label: {
        fontsize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        backgroundColor: '#1d7036',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontsize: 16,
        fontWeight: 'bold',
    },
});


export default CreateChannelScreen;