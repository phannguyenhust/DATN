import React, { useState, useEffect } from 'react';
import { useTimers } from '../context/TimerContext';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Navigation } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import { formatDate } from '../utils/dateUtils'; // Import the formatDate function

import Background from '../components/Background';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import moment from 'moment';
import { resumeDownload } from 'react-native-fs';
import { color } from '@rneui/themed/dist/config';
import { ScrollView } from 'react-native-gesture-handler';
import MonitorBackground from '../components/MonitorBackground';
import { useRoute } from '@react-navigation/native';

const AddTimer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
    const { addTimer, timers, setTimers } = useTimers();

    const route = useRoute();
    const deviceId = route.params?.deviceId; // Read the deviceId parameter from the route
  
    // If deviceId is not provided, use the default value
    const [deviceIdState, setDeviceIdState] = useState(deviceId || 'esp');
  const [startTimeHour, setStartTimeHour] = useState(''); // State lưu giờ bắt đầu
  const [startTimeMinute, setStartTimeMinute] = useState(''); // State lưu phút bắt đầu
  const [endTimeHour, setEndTimeHour] = useState(''); // State lưu giờ kết thúc
  const [endTimeMinute, setEndTimeMinute] = useState(''); // State lưu phút kết thúc
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // State hiển thị DateTimePicker bắt đầu
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // State hiển thị DateTimePicker kết thúc

  const [selectedControlDevice, setSelectedControlDevice] = useState('');
  const [selectedMeasureDevice, setSelectedMeasureDevice] = useState('');

  const [lowerThresholdValue, setLowerThresholdValue] = useState('');
  const [upperThresholdValue, setUpperThresholdValue] = useState('');

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  const [isCheckedDaily, setIsCheckedDaily] = useState(false);
  // const today = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isCheckedThreshold, setIsCheckedThreshold] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [stateToggle, setStateToggle] = useState(true);


  const fakeDeviceOptions = ['Bơm', 'Đèn', 'Quạt']; // Array of fake device options

    // const handleCheckDateType1 = () => {
    //     setIsCheckedDateType1(!isCheckedDateType1);
    //     setIsCheckedDateType2(false);

    // }
    // const handleCheckDateType2 = () => {
    //     setIsCheckedDateType2(!isCheckedDateType2);
    //     setIsCheckedDateType1(false);
    // }


    useEffect(() => {
        console.log('1: ' + startTimeHour);
      }, [startTimeHour]);
    
      useEffect(() => {
        console.log(" 2:  " + startTimeMinute);
      }, [startTimeMinute]);

    const handleCheckDaily = () => {
        setIsCheckedDaily(!isCheckedDaily);

    };
    const handleDateChange = (event, selectedDate) => {
        setShow(false);
        if (selectedDate) {
          const selectedDateMoment = moment(selectedDate, 'YYYY-MM-DD');
          setSelectedDate(selectedDateMoment.format('YYYY-MM-DD'));
          console.log(selectedDateMoment.format('YYYY-MM-DD'));
        }
      };
    

    const handleCheck = () => {
        setIsCheckedThreshold(!isCheckedThreshold);
    };

    const handleCheck1 = () => {
        if (!isChecked1) {
            setIsChecked1(true);
            setIsChecked2(false);
            setSelectedType('upper');
        }
    };
    
    const handleCheck2 = () => {
        if (!isChecked2) {
            setIsChecked2(true);
            setIsChecked1(false);
            setSelectedType('lower');
        }
    };
    





    const handleAddTimer = async () => {
        // const startTime = moment().hour(startTimeHour).minute(startTimeMinute).second(0).format('HH:mm:ss');
        // const endTime = moment().hour(endTimeHour).minute(endTimeMinute).second(0).format('HH:mm:ss');
        console.log(isCheckedDaily)
        if(isCheckedDaily){
            setSelectedDate(null);
        }

        if(!isCheckedThreshold){
            setSelectedMeasureDevice('');
            setLowerThresholdValue('');
            setUpperThresholdValue('');
            setSelectedType('');
        }



        const newTimer = {
            device_id: deviceId,
            type_control_device: selectedControlDevice,
            start_time: startTime,
            end_time: endTime,
            is_daily: isCheckedDaily,
            selected_date: isCheckedDaily ? null : selectedDate,
            is_check_threshold: isCheckedThreshold,
            type_measure_device: selectedMeasureDevice,
            lower_threshold_value: lowerThresholdValue,
            upper_threshold_value: upperThresholdValue,
            is_enabled: stateToggle,
        };

        try {
            const response = await fetch('http://18.139.83.15:3000/api/automation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTimer),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const savedTimer = await response.json();
            console.log('Saved Timer Data:', savedTimer);
    
            addTimer(savedTimer); // Cập nhật context với bộ hẹn giờ đã có ID từ server
            const newTimers = [...timers, savedTimer]; // savedTimer là timer mới từ server với ID
            setTimers(newTimers); // Cập nhật danh sách timers trong context
            navigation.goBack(); // Điều hướng về trang TimerList
        } catch (error) {
            console.error('Error adding timer:', error);
        }
  };

  // Hàm xử lý khi người dùng thay đổi giờ và phút bắt đầu
  const onChangeStartTime = (event: Event, selectedTime: Date | undefined) => {
    if (selectedTime) {
      const currentTime = selectedTime || new Date();
      setShowStartTimePicker(false);
      setStartTimeHour(currentTime.getHours().toString());
      setStartTimeMinute(currentTime.getMinutes().toString());
    currentTime.setSeconds(0); // Đặt giây thành 0
    const formattedTime = moment(currentTime).format('HH:mm:ss'); // Format giờ phút giây
    setStartTime(formattedTime);
    }
  };


  // Hàm xử lý khi người dùng thay đổi giờ và phút kết thúc
  const onChangeEndTime = (event: Event, selectedTime: Date | undefined) => {
    if (selectedTime) {
        const currentTime = selectedTime || new Date();
        setShowEndTimePicker(false);
        setEndTimeHour(currentTime.getHours().toString());
        setEndTimeMinute(currentTime.getMinutes().toString());
        currentTime.setSeconds(0); // Đặt giây thành 0
        const formattedTime = moment(currentTime).format('HH:mm:ss'); // Format giờ phút giây
        setEndTime(formattedTime);
    }
  };

  return (
    <MonitorBackground>
      <View style={styles.container}>
        
      <Text style={styles.title}>Add Timer</Text>
      <ScrollView>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Device:</Text>
        <Picker style = {styles.picker}
          selectedValue={selectedControlDevice}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedControlDevice(itemValue)
          }>
          <Picker.Item style={styles.pickerItem} label="Chọn" value="" />
          {fakeDeviceOptions.map((device, index) => (
            <Picker.Item key={index} label={device} value={device} />
          ))}
        </Picker>
        </View>
        {/* <TextInput
            style={styles.input}
            placeholder="Device ID"
            value={deviceId}
            onChangeText={setDeviceId}
        /> */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Input Start Time:</Text>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
          <Icon name="clock-o" size={20} color="black" style={styles.icon} />
          <Text style={styles.setTimeText}>{`${startTimeHour}:${startTimeMinute}`}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={new Date()} // Giá trị mặc định của DateTimePicker
            mode="time" // Chế độ chọn thời gian
            is24Hour={true} // Sử dụng định dạng 24 giờ
            display="default" // Kiểu hiển thị mặc định
            onChange={onChangeStartTime} // Hàm xử lý khi thay đổi thời gian
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Input End Time:</Text>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <Icon name="clock-o" size={20} color="black" />
          <Text style={styles.setTimeText}>{`${endTimeHour}:${endTimeMinute}`}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={new Date()} // Giá trị mặc định của DateTimePicker
            mode="time" // Chế độ chọn thời gian
            is24Hour={true} // Sử dụng định dạng 24 giờ
            display="default" // Kiểu hiển thị mặc định
            onChange={onChangeEndTime} // Hàm xử lý khi thay đổi thời gian
          />
        )}
      </View>
      <View style={styles.checkboxRow}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={handleCheckDaily}>
                <Icon name={isCheckedDaily ? 'check-square' : 'square'} size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Hàng ngày</Text>
            </View>
        </View>

        {!isCheckedDaily && (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Date:</Text>
            <TouchableOpacity onPress={() => setShow(true)}>
            <Icon name="calendar" size={20} color="black" style={styles.icon} />
            <Text style={styles.setTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            {show && (
            <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
            />
            )}
        </View>
        )}

        <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={handleCheck}>
                <Icon name={isCheckedThreshold ? 'check-square' : 'square'} size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.label}>Enable Device Measure</Text>
        </View>

        {isCheckedThreshold ? (
          <View style={styles.deviceMeasureContainer}>
          <Text style={styles.label}>Chọn Thiết Bị Đo:</Text>
          <View style={styles.pickerContainer}>
            {/* Thêm picker về thiết bị đo ở đây */}
            <Picker
              style={styles.picker}
              selectedValue={selectedMeasureDevice}
              onValueChange={(itemValue, itemIndex) => setSelectedMeasureDevice(itemValue)}
            >
              <Picker.Item label="Nhiệt Độ" value="temperature" />
              <Picker.Item label="Độ Ẩm Đất" value="soil_humidity" />
            </Picker>
          </View>
  
          <Text style={styles.label}>Nhập Ngưỡng dưới:</Text>
          <TextInput
            style={styles.input}
            value={lowerThresholdValue}
            onChangeText={(text) => setLowerThresholdValue(text)}
            placeholder="Nhập ngưỡng dưới"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Nhập Ngưỡng trên:</Text>
          <TextInput
            
            style={styles.input}
            value={upperThresholdValue}
            onChangeText={(text) => setUpperThresholdValue(text)}
            placeholder="Nhập ngưỡng trên"
            keyboardType="numeric"
          />
           {/* <View style={styles.checkboxRow}>
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
          </View> */}
        


        </View>
      
      ) : null}

        <Button title="Add Timer" onPress={handleAddTimer} />
        </ScrollView>
    </View>
    </MonitorBackground>
    
        );
        };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: 'black',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
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
});

export default AddTimer;
