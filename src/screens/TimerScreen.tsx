import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import axios from 'axios';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { useTimers } from '../context/TimerContext';

const TimerScreen = () => {
  const navigation = useNavigation();
  const {timers, setTimers} = useTimers();
  const [automations, setAutomations] = useState([]);
  const [toggleStates, setToggleStates] = useState({});

  useEffect(() =>{
    console.log("Function automation: ",timers );
  }, [timers]);

  

  const GetAutomationFromDB = async () => {
    try {
      const response = await axios.get('http://18.139.83.15:3000/api/automation');
      console.log('Automation data from API:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Error loading automations from database:', error);
    }
  };

  

  const loadAutomationsFromDatabase = async () => {
    const dbTimers = await GetAutomationFromDB();
    const mergedTimers = [...timers, ...dbTimers.filter(dbTimer => !timers.some(timer => timer.id === dbTimer.id))];
    setTimers(mergedTimers);

    const initialToggleStates = mergedTimers.reduce((acc, timer) => {
      acc[timer.id] = timer.is_enabled === 1; // update toggle state from API response
      return acc;
    }, {});
    setToggleStates(initialToggleStates);
  }; 

  React.useEffect(() => {
    loadAutomationsFromDatabase();
  }, []);

  const formatTime = (dateTimeString) => {
    return moment(dateTimeString).format('YYYY-MM-DD HH:mm');
  };

  const handleToggleChange = (value, timerId) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [timerId]: value,
    }));
    console.log(`Automation ID: ${timerId}, Toggle Value: ${value}`);
  };
  

  const handleLongPress = (timerId, type) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${type}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await axios.delete(`http://18.139.83.15:3000/api/automation/${timerId}`);
              const updatedTimers = timers.filter(timer => timer.id !== timerId);
              setTimers(updatedTimers);
              Alert.alert(`Đã xóa "${type}"`);
            } catch (error) {
              console.error('Error deleting automation from the database:', error);
              Alert.alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
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
        <Text style={styles.title}>Danh sách chức năng tự động</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTimerScreen')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          {timers.map(timer => (
            <View key={timer.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardContentWrapper}
                onLongPress={() => handleLongPress(timer.id, timer.type)}
                
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{timer.type || 'Unknown Type'}</Text>
                  <Text style={{ color: 'black' }}>Thời gian bắt đầu: {formatTime(timer.start_time)}</Text>
                  <Text style={{ color: 'black' }}>Thời gian kết thúc: {formatTime(timer.end_time)}</Text>
                  {timer.has_threshold === 1 && (
                    <View>
                      <Text style={{ color: 'black' }}>
                        Thiết bị đo: {timer.type_measure_device}
                      </Text>
                      <Text style={{ color: 'black' }}>
                        Giá trị ngưỡng: {timer.threshold_value}
                      </Text>
                      <Text style={{ color: 'black' }}>
                        Loại ngưỡng: {timer.type_threshold}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <Switch
                style={styles.toggle}
                value={toggleStates[timer.id] || false}
                onValueChange={(value) => handleToggleChange(value, timer.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  cardContentWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
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
  toggle: {
    marginLeft: 'auto',
  },
});

export default TimerScreen;