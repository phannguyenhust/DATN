import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TouchableWithoutFeedback, Switch } from 'react-native';
import { useTimers } from '../context/TimerContext';
import { Navigation } from '../types';
import MonitorBackground from '../components/MonitorBackground';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import Background from '../components/Background';
import { useNavigation, RouteProp } from '@react-navigation/native'; // Import hook useNavigation

type TimerListRouteProp = {
  TimerList: {
    deviceId: string;
  };
};


const TimerList: React.FC<{ navigation: Navigation; route: RouteProp<TimerListRouteProp, 'TimerList'> }> = ({ navigation, route }) => {
  const { timers, setTimers } = useTimers();
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});

  const nav = useNavigation(); // Sử dụng hook useNavigation
  const { deviceId } = route.params;
  console.log(deviceId);

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const response = await fetch(`http://18.139.83.15:3000/api/automation?device_id=${deviceId}`);
        const data = await response.json();
        console.log('Fetched timers:', data);
        setTimers(data);

        // Initialize toggleStates based on is_enabled property of each timer
        const initialToggleStates = data.reduce((acc: { [key: string]: boolean }, timer: { id: string; is_enabled: boolean }) => {
          acc[timer.id] = timer.is_enabled === 1; // Ensure is_enabled is treated as boolean
          return acc;
        }, {});
        setToggleStates(initialToggleStates);

      } catch (error) {
        console.error('Error fetching timers:', error);
      }
    };

    fetchTimers();
  }, [setTimers, deviceId]);


  //đồng bộ toggle
  useEffect(() => {
    // Sync toggleStates with timers when timers change
    const initialToggleStates = timers.reduce((acc: { [key: string]: boolean }, timer: { id: string; is_enabled: boolean }) => {
      acc[timer.id] = timer.is_enabled === 1 || timer.is_enabled === true; // Handle both number and boolean cases
      return acc;
    }, {});
    setToggleStates(initialToggleStates);
  }, [timers]);

  //xóa
  const handleLongPress = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this timer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteTimer(id),
        },
      ],
      { cancelable: false }
    );
  };

  //API xóa
  const deleteTimer = async (id: string) => {
    try {
      await fetch(`http://18.139.83.15:3000/api/automation/${id}`, {
        method: 'DELETE',
      });
      setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
    } catch (error) {
      console.error('Error deleting timer:', error);
    }
  };

  const handleEditTimer = (id: string) => {
    navigation.navigate('EditTimer', { timerId: id });
  };

  const handleToggleChange = async (value: boolean, id: string) => {
    console.log(`Automation ID: ${id}, Toggle Value: ${value}`);
    setToggleStates((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    
    // Update the server with the new toggle state
    try {
      const response = await fetch(`http://18.139.83.15:3000/api/automation/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_enabled: value }),
      });
      if (!response.ok) {
        throw new Error('Failed to update toggle state');
      }
      const updatedTimers = timers.map((timer) =>
        timer.id === id ? { ...timer, is_enabled: value } : timer
      );
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error updating toggle state:', error);
    }
  };

  return (
    <MonitorBackground>
      <BackButton goBack={() => nav.goBack()} />
      <View style={styles.container}>
      <Text style={styles.title}>Timer List</Text>
      <Button title="Add New Timer" onPress={() => navigation.navigate('AddTimer', { deviceId: deviceId })} />
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onLongPress={() => handleLongPress(item.id)}>
            <View style={styles.timerItem}>
              <Text style={{ color: 'black' }}>{`ID: ${item.id}`}</Text>
              <Text style={{ color: 'black' }}>{`Device ID: ${item.device_id}`}</Text>
              <Text style={{ color: 'black' }}>{`Start Time: ${item.start_time}`}</Text>
              <Text style={{ color: 'black' }}>{`End Time: ${item.end_time}`}</Text>
              <Text style={{ color: 'black' }}>{`Thiết bị: ${item.type_control_device}`}</Text>
              {item.is_daily ? (
                <Text style={{ color: 'black' }}>Trạng thái hoạt động: hàng ngày</Text>
              ) : (
                <Text style={{ color: 'black' }}>{`Ngày: ${item.selected_date}`}</Text>
              )}
              {item.is_check_threshold ? (
  <>
                <Text style={{ color: 'black' }}>{`Type Measure Device: ${item.type_measure_device}`}</Text>
                {item.lower_threshold_value !== null && item.lower_threshold_value !== '' ? (
                <Text style={styles.text}>Lower Threshold Value: {item.lower_threshold_value}</Text>
                ) : null}

                {item.upper_threshold_value !== null && item.upper_threshold_value !== '' ? (
                    <Text style={styles.text}>Upper Threshold Value: {item.upper_threshold_value}</Text>
                ) : null}

              </>
            ) : null}




              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                  style={styles.toggle}
                  value={toggleStates[item.id] || false} // Ensure default value is false if undefined
                  onValueChange={(value) => handleToggleChange(value, item.id)}
                />
                <TouchableWithoutFeedback onPress={() => handleEditTimer(item.id)}>
                  <Icon name="edit" size={20} color="black" style={styles.editIcon} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
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
  },
  timerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  toggle: {
    marginLeft: 'auto',
  },
  editIcon: {
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black',
},
});

export default TimerList;
