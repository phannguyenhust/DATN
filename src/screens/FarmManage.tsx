import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Farm {
  idFarm: number;
  nameFarm: string;
  addressFarm: string;
}

interface Garden {
  idGarden: number;
  nameGarden: string;
  deviceId: string;
  datePlanting: string;
}

const FarmManage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const fetchFarms = async () => {
    try {
      const response = await fetch('http://18.139.83.15:3000/api/farms');
      const data = await response.json();
      console.log('Fetched farms:', data);
      setFarms(data);
    } catch (error) {
      setError('Error fetching farms');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFarms();
    }, [])
  );

  const handleFarmPress = (idFarm: number, addressFarm: string) => {
    navigation.navigate('FarmDetail', { farmId: idFarm, addressFarm });
  };

  const handleLongPressFarm = (idFarm: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this farm?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
        { text: 'OK', onPress: () => deleteFarm(idFarm) }
      ],
      { cancelable: false }
    );
  };

  const deleteFarm = async (idFarm: number) => {
    try {
      // Xóa trang trại từ cơ sở dữ liệu
      const response = await fetch(`http://18.139.83.15:3000/api/farms/${idFarm}`, {
        method: 'DELETE'
      });
      if (response.status === 200) {
        // Nếu xóa thành công, cập nhật lại danh sách trang trại
        fetchFarms();
      } else {
        throw new Error('Failed to delete farm');
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
      Alert.alert('Failed to delete farm');
    }
  };

  const handleEditFarm = (idFarm: number) => {
    navigation.navigate('EditFarm', { idFarm });
  };

  const renderFarmItem = ({ item }: { item: Farm }) => (
    <TouchableWithoutFeedback onPress={() => handleFarmPress(item.idFarm, item.addressFarm)} onLongPress={() => handleLongPressFarm(item.idFarm)}>
      <View style={styles.farmItem}>
        <Text style={{ color: 'black' }}>{`ID: ${item.idFarm}`}</Text>
        <Text style={{ color: 'black' }}>{`Name: ${item.nameFarm}`}</Text>
        <Text style={{ color: 'black' }}>{`Address: ${item.addressFarm}`}</Text>
        {/* <TouchableOpacity onPress={() => handleEditFarm(item.idFarm)}> */}
        <TouchableOpacity onPress={() => navigation.navigate('EditFarm', { 
        farmId: item.idFarm,
        nameFarm: item.nameFarm,
        addressFarm: item.addressFarm 
      })}>
                  <Icon name="edit" size={20} color="black" />
                </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm List</Text>
      <Button title="Add New Farm" onPress={() => navigation.navigate('AddFarm')} />
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={farms}
          keyExtractor={(item) => item.idFarm.toString()}
          renderItem={renderFarmItem}
        />
      )}
    </View>
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
  farmItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
});

export default FarmManage;
