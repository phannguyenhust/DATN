import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';

const CameraScreen = () => {
    const [{ cameraRef }, { takePicture }] = useCamera();

    const captureHandle = async () => {
        try {
            const data = await takePicture();
            console.log(data.uri); // Log the path of the captured image
            const filePath = data.uri;
            const newFilePath = RNFS.ExternalCachesDirectoryPath + '/MyTestCamera.jpg';
            
            // Check if the file exists
            const fileExists = await RNFS.exists(filePath);
            if (fileExists) {
                // Move the file if it exists
                await RNFS.moveFile(filePath, newFilePath);
                console.log('Image moved successfully.');
            } else {
                console.log('Image does not exist.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.body}>
            <RNCamera
                ref={cameraRef}
                type={RNCamera.Constants.Type.back}
                style={styles.preview}
            />
            <TouchableOpacity onPress={captureHandle} style={styles.capture}>
                <Text style={{ color: 'black', fontSize: 14 }}>Capture</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export default CameraScreen;
