import React, { memo, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';


type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => (
  <Background>
    <View style={styles.header}>
        <Text style={styles.title}>Danh sách vườn</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('QRScreen')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    <Logo />
    <View style={styles.container}>
      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('FarmManage')}
        >
          Quản lý nông trại
        </Button>
      </View>
      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('DetectScreen')}
        >
          Nhận diện bệnh
        </Button>
      </View>
      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          Thông tin cá nhân
        </Button>
      </View>
    <Button mode="outlined" onPress={() => navigation.navigate('HomeScreen')}>
      Đăng xuất
    </Button>
    </View>
  </Background>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 10,
    width: '80%',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingLeft: 90,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
export default memo(Dashboard);
