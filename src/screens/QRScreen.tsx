import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import BackButton from '../components/BackButton';
import Background from '../components/Background';
import { Navigation } from '../types';
import { useNavigation } from '@react-navigation/native'; // Import hook useNavigation

type Props = {
    navigation: Navigation;
};

const QRScreen = () => {
  const [scannedData, setScannedData] = useState(null);

  const nav = useNavigation();

  const onSuccess = (e) => {
    setScannedData(e.data);
  };

  const copyToClipboard = () => {
    if (scannedData) {
        Clipboard.setString(scannedData);
        Alert.alert('Đã lưu vào clipboard');
      } else {
        Alert.alert('Không có QR được quét!');
      }
  };

  return (
    <View style={styles.container}>
      {!scannedData ? (
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topContent={<Text style={styles.centerText}>Scan a QR code</Text>}
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <Background>
        <BackButton goBack={() => nav.goBack()} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Mã QR: {scannedData}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Text style={styles.buttonText}>Lưu vào Clipboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScannedData(null)} style={styles.scanAgainButton}>
            <Text style={styles.buttonText}>Quét lại</Text>
          </TouchableOpacity>
        </View>
        </Background>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonText: {
    fontSize: 21,
    color: 'white',
  },
  buttonTouchable: {
    padding: 16,
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  copyButton: {
    padding: 10,
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  scanAgainButton: {
    padding: 10,
    backgroundColor: 'green',
  }
});

export default QRScreen;
