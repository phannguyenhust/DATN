import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Alert } from 'react-native';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { useGardens } from '../context/GardenContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatDate } from '../utils/dateUtils'; // Import the formatDate function
import axios from 'axios';
import moment from 'moment';


const AddGardenScreen = () => {
  const navigation = useNavigation();
  const { addGarden } = useGardens();

  const [nameGarden, setNameGarden] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [datePlanting, setdatePlanting] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleAddGarden = async() => {
    const newGarden = {
      nameGarden,
      deviceId,
      datePlanting: moment(datePlanting).format('YYYY-MM-DD'),
    };
  
    try {
      // Send a POST request to the database
      const response = await axios.post('http://18.139.83.15:3000/api/gardens', newGarden);
      if (response.status === 201) {
        Alert.alert('Thêm vườn thành công');
      }
      const savedGarden = response.data;
  
      // Add the saved garden to the local state
      addGarden({
        id: Math.random().toString(36).substring(7),
        nameGarden,
        deviceId,
        datePlanting: formatDate(datePlanting),
        image: require('../assets/greenhouse1.png'),
      });
  
      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error adding garden to the database:', error);
      Alert.alert('Có lỗi xảy ra khi thêm vườn. Vui lòng thử lại.');
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.title}>Thêm vườn mới</Text>
        <Text style={styles.label}>Tên vườn:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên vườn"
          value={nameGarden}
          onChangeText={setNameGarden}
        />
        <Text style={styles.label}>Mã thiết bị:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mã thiết bị"
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <TouchableOpacity onPress={() => setOpen(true)} style={styles.datePicker}>
          <Icon name="calendar" size={20} color="black" style={styles.icon} />
          <Text style={styles.datePickerText}>Ngày trồng: {formatDate(datePlanting)}</Text>
        </TouchableOpacity>
        <Button title="Thêm vườn" onPress={handleAddGarden} />
        <Modal transparent={true} animationType="slide" visible={open} onRequestClose={() => setOpen(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={datePlanting}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  setOpen(false);
                  if (date) {
                    setdatePlanting(date);
                  }
                }}
              />
              
            </View>
          </View>
        </Modal>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    color: 'black',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  datePickerText: {
    color: 'black',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default AddGardenScreen;
