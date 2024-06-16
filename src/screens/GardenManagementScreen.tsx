import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { useGardens } from '../context/GardenContext';
import Icon from 'react-native-vector-icons/FontAwesome';


import axios from 'axios';
import { formatDate } from '../utils/dateUtils'; // Import the formatDate function


const GardenManagementScreen = () => {
  const navigation = useNavigation();
  const { gardens, setGardens } = useGardens(); // Sử dụng setGardens để cập nhật danh sách vườn

  useEffect(() => {
    console.log('Gardens:', gardens); // Log ra danh sách vườn sau mỗi lần có thay đổi
  }, [gardens]);

  // useEffect(() => {
  //   loadGardensFromDatabase();
  // }, []);

  const getGardensFromDB = async () => {
    try {
      const response = await axios.get('http://18.139.83.15:3000/api/gardens');
      const formattedGardens = response.data.map(garden => ({
        id: garden.idGarden,
        nameGarden: garden.nameGarden,
        deviceId: garden.deviceId,
        datePlanting: formatDate(garden.datePlanting),
        image: require('../assets/greenhouse1.png'),
      }));
      console.log('Dữ liệu vườn từ API:', formattedGardens);
      return formattedGardens;
    } catch (error) {
      console.error('Error loading gardens from database:', error);
      return [];
    }
  };
  
  // Hàm chuyển đổi định dạng ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  useEffect(() => {
    loadGardensFromDatabase();
  }, []);

  const loadGardensFromDatabase = async () => {
    const dbGardens = await getGardensFromDB();
    const mergedGardens = [...gardens, ...dbGardens.filter(dbGarden => !gardens.some(garden => garden.id === dbGarden.id))];
    setGardens(mergedGardens);

  };

  const handleGardenPress = (nameGarden: string, deviceId: string, datePlanting: string) => {
    navigation.navigate('Monitor', { 
      deviceId: deviceId,
      nameGarden: nameGarden,
      datePlanting: datePlanting,
      addressFarm
    });
  };
  // const handleEditGarden = (id: string) => {
  //   navigation.navigate('EditTimer', {id: id});
  // };
  

  const handleLongPress = (deviceId: string, nameGarden: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa vườn "${nameGarden}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async() => {
            try {
              // Gửi yêu cầu DELETE đến API để xóa vườn khỏi cơ sở dữ liệu dựa trên deviceId
              await axios.delete(`http://18.139.83.15:3000/api/gardens/${deviceId}`);
  
              // Nếu xóa thành công, cập nhật state local của ứng dụng
              const updatedGardens = gardens.filter(garden => garden.deviceId !== deviceId);
              setGardens(updatedGardens);
              Alert.alert(`Đã xóa vườn "${nameGarden}" có mã thiết bị: ${deviceId}`);
            } catch (error) {
              console.error('Error deleting garden from the database:', error);
              Alert.alert('Có lỗi xảy ra khi xóa vườn. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.goBack()} />
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách vườn</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddGardenScreen')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {gardens.map(garden => (
          <TouchableOpacity
            key={garden.id}
            style={styles.card}
            onPress={() => handleGardenPress(garden.nameGarden, garden.deviceId, garden.datePlanting)}
            onLongPress={() => handleLongPress(garden.deviceId, garden.nameGarden)}
          >
            <Image source={garden.image} style={[styles.image]} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{garden.nameGarden}</Text>
              <Text style={{ color: 'black' }}>Ngày trồng: {garden.datePlanting}</Text>
              <Text style={{ color: 'black' }}>Mã thiết bị: {garden.deviceId}</Text>
            </View>
            {/* <TouchableWithoutFeedback onPress={() => handleEditGarden(garden.id)}>
                  <Icon name="edit" size={20} color="black" style={styles.editIcon} />
                </TouchableWithoutFeedback> */}
          </TouchableOpacity>
        ))}
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingLeft: 90,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
    width: '100%',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 70,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 10,
  },
});

export default GardenManagementScreen;
