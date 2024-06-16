import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useTimers } from '../context/TimerContext';
import { Navigation } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import MonitorBackground from '../components/MonitorBackground';



interface EditTimerProps {
  navigation: Navigation;
  route: { params: { timerId: string } };
}

const EditTimer: React.FC<EditTimerProps> = ({ navigation, route }) => {
  const { timers, updateTimer } = useTimers();
  const timerId = route.params.timerId;
  const timer = timers.find((timer) => timer.id === timerId);

  if (!timer) {
    return <Text>Timer not found</Text>;
  }
  const today = moment().format('YYYY-MM-DD');
  const initialDate = timer.selected_date ? timer.selected_date : today;
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [deviceID, setDeviceID] = useState(timer.device_id);
  const [startTime, setStartTime] = useState(timer.start_time);
  const [endTime, setEndTime] = useState(timer.end_time);
  const [typeControlDevice, setTypeControlDevice] = useState(timer.type_control_device);
  const [isDaily, setIsDaily] = useState(timer.is_daily);
  // const [selectedDate, setSelectedDate] = useState(timer.selected_date);
  const [isCheckThreshold, setIsCheckThreshold] = useState(timer.is_check_threshold);
  const [lowerThresholdValue, setLowerThresholdValue] = useState(timer.lower_threshold_value);
  const [upperThresholdValue, setUpperThresholdValue] = useState(timer.upper_threshold_value);
  const [typeMeasureDevice, setTypeMeasureDevice] = useState(timer.type_measure_device);


  const handleSave = async () => {
    if(!isCheckThreshold){
      setTypeMeasureDevice('');
      setLowerThresholdValue('');
      setUpperThresholdValue('');
    }

    const updatedTimer = {
      id: timerId,
      device_id: deviceID,
      start_time: startTime,
      end_time: endTime,
      type_control_device: typeControlDevice,
      is_daily: isDaily,
      selected_date: isDaily ? null : selectedDate,
      is_check_threshold: isCheckThreshold,
      type_measure_device: typeMeasureDevice,
      lower_threshold_value: lowerThresholdValue,
      upper_threshold_value: upperThresholdValue,
      is_enabled: true,
    }

    try {
      if (!updatedTimer.device_id || !updatedTimer.start_time || !updatedTimer.end_time) {
        throw new Error('Please fill in all required fields');
      }
      
      const response = await fetch(`http://18.139.83.15:3000/api/automation/${timerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTimer),
      });
      if (!response.ok) {
        throw new Error('Failed to update timer');
      }
      updateTimer(timerId, updatedTimer);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating timer:', error);
    }
  };

  const handleCheckDaily  = () => {
    setIsDaily(!isDaily);

  };
  const handleCheck = () => {
    setIsCheckThreshold(!isCheckThreshold);
};

  return (
    <MonitorBackground>
       <View style={styles.container}>
      <Text style={styles.title}>Edit Timer</Text>
      <ScrollView>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Chọn thiết bị điều khiển: </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={typeControlDevice}
          onValueChange={(itemValue) => setTypeControlDevice(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn thiết bị" value="" />
          <Picker.Item label="Quạt" value="Quạt" />
          <Picker.Item label="Bơm" value="Bơm" />
          <Picker.Item label="Đèn" value="Đèn" />
        </Picker>
      </View>
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Start time: </Text>
        <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={(text) => setStartTime(text)}
        placeholder="Start Time"
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>End time: </Text>
        <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={(text) => setEndTime(text)}
        placeholder="End Time"
      />
      </View>
      <View style={styles.checkboxRow}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={handleCheckDaily}>
                <Icon name={isDaily ? 'check-square' : 'square'} size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Hàng ngày</Text>
            </View>
      </View>
      {!isDaily && (
        <View style={styles.inputContainer}>
        <TextInput
        style={styles.input}
        value={selectedDate}
        onChangeText={(text) => setSelectedDate(text)}
        placeholder="YYYY-MM-DD"
      />
      </View>
        )}
      <View style={styles.checkboxRow}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={handleCheck}>
                <Icon name={isCheckThreshold ? 'check-square' : 'square'} size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Kiểm tra theo thiết bị đo</Text>
            </View>
      </View>
      {isCheckThreshold ? (
        <View style={styles.deviceMeasureContainer}>
          <View style={styles.inputContainer}>
        <Text style={styles.label}>Chọn thiết bị đo: </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={typeMeasureDevice}
            onValueChange={(itemValue) => setTypeMeasureDevice(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn thiết bị đo" value="" />
            <Picker.Item label="Nhiệt độ" value="temperature" />
            <Picker.Item label="Độ ẩm đất" value="soil_humidity" />
          </Picker>
        </View>
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Nhập Ngưỡng dưới:</Text>
          <TextInput
          style={styles.input}
          value={lowerThresholdValue}
          onChangeText={(text) => setLowerThresholdValue(text)}
          placeholder="Lower Threshold Value"
        />
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Nhập Ngưỡng trên:</Text>
           <TextInput
          style={styles.input}
          value={upperThresholdValue}
          onChangeText={(text) => setUpperThresholdValue(text)}
          placeholder="Upper Threshold Value"
        />
        </View>
        </View>
        
      ) : null}
      
     
      <Button title="Save" onPress={handleSave} />
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
    alignContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
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

export default EditTimer;