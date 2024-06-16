// AddTimerScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Modal, Alert, SafeAreaView } from 'react-native';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import moment from 'moment';
import { resumeDownload } from 'react-native-fs';
import { color } from '@rneui/themed/dist/config';
import { useTimers } from '../context/TimerContext';




const AddTimerScreen = () => {
    const navigation = useNavigation();
    const { addTimer } = useTimers();  // Use addTimer from context
  const [selectedDevice, setSelectedDevice] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [threshold, setThreshold] = useState('');
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const [startTimeHour, setStartTimeHour] = useState('');
  const [startTimeMinute, setStartTimeMinute] = useState('');
  const [endTimeHour, setEndTimeHour] = useState('');
  const [endTimeMinute, setEndTimeMinute] = useState('');
  const [hasThreshold, setHasThreshold] = useState(false); 
  const [typeThreshold, setTypeThreshold] = useState(null); //cao-thấp
  const [type, setType] = useState('');

  const fakeDeviceOptions = ['Pump', 'Light', 'Fan']; // Array of fake device options
  const measureOptions = ['Temperature', 'Humidity', 'Pressure']; // Array of measure options
  const unitOptions = ['Celsius', 'Fahrenheit', 'Kelvin']; // Array of unit options
  const typeOptions = ['Kiểu 1', 'Kiểu 2']; // Array of type options

  const [deviceId, setDeviceId] = useState('esp');
  

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleCheck1 = () => {
    setIsChecked1(!isChecked1);
    if (isChecked1) {
        setIsChecked2(false);
        setSelectedType('upper');
      }
  };

  const handleCheck2 = () => {
    setIsChecked2(!isChecked2);
    if (isChecked2) {
        setIsChecked1(false);
        setSelectedType('lower');
     }
  };
  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSave = async () => {
    const startTime = moment().hour(startTimeHour).minute(startTimeMinute).second(0).format('YYYY-MM-DD HH:mm:ss');
  const endTime = moment().hour(endTimeHour).minute(endTimeMinute).second(0).format('YYYY-MM-DD HH:mm:ss');

    // Tạo một object mới chứa các dữ liệu cần insert vào cơ sở dữ liệu
    const newTimer = {
      start_time: startTime, // Giả sử giờ bắt đầu là 15:15:00
      end_time: endTime, // Giả sử giờ kết thúc là 03:20:00
      device_id: deviceId,
      has_threshold: isChecked,
      type: selectedDevice,
    };

    if (!isChecked) {
      setSelectedType(null);
      setThreshold('');
      setSelectedMeasure('');
    }
    newTimer.type_measure_device = selectedMeasure;
    console.log(newTimer.type_measure_device);
    console.log(newTimer.threshold_value);
    console.log(newTimer.type_threshold);

    newTimer.type_threshold = selectedType;
    newTimer.threshold_value = threshold;
    console.log(newTimer);
    // Send the new timer data to the database
    try {
      const response = await axios.post('http://18.139.83.15:3000/api/automation', newTimer);
      if (response.status === 201) {
        Alert.alert('Thêm thành công');
      }
      console.log('hihi' + selectedDevice);
      addTimer({
        id: Math.random().toString(36).substring(7),
        deviceId,
        startTime,
        endTime,
        isChecked,
        threshold,
        selectedType ,
        selectedDevice,
        selectedMeasure,
        is_enabled: 1,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const showStartTimePickerModal = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimePickerModal = () => {
    setShowEndTimePicker(true);
  };

  const onChangeStartTime = (event: Event, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || new Date();
    setShowStartTimePicker(false);
    setStartTimeHour(currentTime.getHours().toString());
    setStartTimeMinute(currentTime.getMinutes().toString());
    console.log(startTimeHour)
    console.log(startTimeMinute)

};

const onChangeEndTime = (event: Event, selectedTime: Date | undefined) => {
  const currentTime = selectedTime || new Date();
  setShowEndTimePicker(false);
  setEndTimeHour(currentTime.getHours().toString());
  setEndTimeMinute(currentTime.getMinutes().toString());
};

  return (

    <Background>
      <BackButton goBack={() => navigation.goBack()} />
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Device Control</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Device:</Text>
        <Picker style = {styles.picker}
          selectedValue={selectedDevice}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedDevice(itemValue)
            
          }>
          <Picker.Item style={styles.pickerItem} label="Select Device" value="" />
          {fakeDeviceOptions.map((device, index) => (
            <Picker.Item key={index} label={device} value={device} />
          ))}
        </Picker>
      </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Input Start Time:</Text>
                    <TouchableOpacity onPress={showStartTimePickerModal}>
                        <Icon name="clock-o" size={20} color="black" style={styles.icon} />
                        <Text style={styles.setTimeText}>{`${startTimeHour}:${startTimeMinute}`}</Text>
                    </TouchableOpacity>
                    {showStartTimePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeStartTime}
                        />
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Input End Time:</Text>
                    <TouchableOpacity onPress={showEndTimePickerModal}>
                        <Icon name="clock-o" size={20} color="black" />
                        <Text style={styles.setTimeText}>{`${endTimeHour}:${endTimeMinute}`}</Text>
                    </TouchableOpacity>
                    {showEndTimePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeEndTime}
                        />
                    )}
                </View>

      
      <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={handleCheck}>
            <Icon name={isChecked ? 'check-square' : 'square'} size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.label}>Enable Device Measure</Text>
        </View>




        {isChecked ? (
          <View style={styles.deviceMeasureContainer}>
          <Text style={styles.label}>Chọn Thiết Bị Đo:</Text>
          <View style={styles.pickerContainer}>
            {/* Thêm picker về thiết bị đo ở đây */}
            <Picker
              style={styles.picker}
              selectedValue={selectedMeasure}
              onValueChange={(itemValue, itemIndex) => setSelectedMeasure(itemValue)}
            >
              <Picker.Item label="Nhiệt Độ" value="temperature" />
              <Picker.Item label="Độ Ẩm Đất" value="soil_humidity" />
            </Picker>
          </View>
  
          <Text style={styles.label}>Nhập Ngưỡng:</Text>
          <TextInput
            
            style={styles.input}
            value={threshold}
            onChangeText={(text) => setThreshold(text)}
            placeholder="Nhập ngưỡng"
            keyboardType="numeric"
          />
  
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={handleCheck1}>
                <Icon name={isChecked1 ? 'check-square' : 'square'} size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Kiểu 1</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={handleCheck2}>
                <Icon name={isChecked2 ? 'check-square' : 'square'} size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Kiểu 2</Text>
            </View>
          </View>
        </View>
      
      ) : null}
      <Button title="Save" onPress={handleSave} />
    </SafeAreaView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  setTimeText: {
    color: 'black',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    
  },
  picker: {
    backgroundColor: '#fff',
    width: 200,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    color: 'black',

  },
  pickerItem: {
    color: 'black',
  },
  icon: {
    marginRight: 10,
  },
  deviceMeasureContainer: {
    color: 'black',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
  },
  
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: 'black',
  },
});

export default AddTimerScreen;