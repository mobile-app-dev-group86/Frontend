// import { useEffect, useRef } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { MediaStream, RtcView } from 'react-native-webrtc';

// const ScreenSharingScreen = () => {
//     const localStream = useRef(null);

//     useEffect(() => {
//         const getUserMedia = async () => {
//             const stream = await MediaStream.getUserMedia({
//                 video: {
//                     mandatory: {
//                         chromeMediaSource: 'screen',
//                     },
//                 },
//                 audio: true,
//             });
//             localStream.current = stream;
//         };

//         getUserMedia();

//         return () => {
//             if (localStream.current) {
//                 localStream.current.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Screen Sharing</Text>
//             {localStream.current && (

//                 <RtcView streamURL={localStream.current.toURL()} style={styles.video} />
//             )}
//             <Button title="Start Sharing" onPress={() => { /* Start sharing logic */ }} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     video: {
//         width: '100%',
//         height: '80%',
//         backgroundColor: '#000',
//         marginBottom: 24,
//     },
// });
// export default ScreenSharingScreen;

