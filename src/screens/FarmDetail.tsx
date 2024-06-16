import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RouteParams {
  farmId: number;
}

interface Garden {
  idGarden: number;
  nameGarden: string;
  deviceId: string;
  datePlanting: string;
}

const FarmDetail: React.FC = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { farmId } = route.params;

  const fetchGardens = async () => {
    try {
      const response = await fetch(`http://18.139.83.15:3000/api/farms/${farmId}/gardens`);
      const data = await response.json();
      console.log('Fetched gardens:', data);
      setGardens(data);
    } catch (error) {
      setError('Error fetching gardens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardens();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh gardens list when the screen is focused
      fetchGardens();
    });

    return unsubscribe;
  }, [navigation]);

  const handleGardenPress = (nameGarden: string, deviceId: string, datePlanting: string) => {
    navigation.navigate('Monitor', { 
      deviceId: deviceId,
      nameGarden: nameGarden,
      datePlanting: datePlanting
    });
  };

  const handleLongPressGarden = (idGarden: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this garden?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
        { text: 'OK', onPress: () => deleteGarden(idGarden) }
      ],
      { cancelable: false }
    );
  };

  const deleteGarden = async (idGarden: number) => {
    try {
      // Xóa khu từ cơ sở dữ liệu
      const response = await fetch(`http://18.139.83.15:3000/api/gardens/${idGarden}`, {
        method: 'DELETE'
      });
      if (response.status === 200) {
        // Nếu xóa thành công, cập nhật lại danh sách khu
        fetchGardens();
      } else {
        throw new Error('Failed to delete garden');
      }
    } catch (error) {
      console.error('Error deleting garden:', error);
      Alert.alert('Failed to delete garden');
    }
  };

  const handleEditGarden = (idGarden: number) => {
    navigation.navigate('EditGarden', { idGarden });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gardens in Farm {farmId}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGarden', { farmId })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : gardens.length === 0 ? (
        <Text>No gardens found</Text>
      ) : (
        <FlatList
          data={gardens}
          keyExtractor={(item) => item.idGarden.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => handleGardenPress(item.nameGarden, item.deviceId, item.datePlanting)} onLongPress={() => handleLongPressGarden(item.idGarden)}>
              <View style={styles.gardenItem}>
                <Text style={{ color: 'black' }}>{`ID: ${item.idGarden}`}</Text>
                <Text style={{ color: 'black' }}>{`Name: ${item.nameGarden}`}</Text>
                <Text style={{ color: 'black' }}>{`Device ID: ${item.deviceId}`}</Text>
                <Text style={{ color: 'black' }}>{`Date Planting: ${item.datePlanting}`}</Text>
                {/* <TouchableOpacity onPress={() => handleEditGarden(item.idGarden)}>
                 */}
                 <TouchableOpacity onPress={() => navigation.navigate('EditGarden', { 
        gardenId: item.idGarden,
        nameGarden: item.nameGarden,
        deviceId: item.deviceId,
        datePlanting: item.datePlanting 
      })}>
                  <Icon name="edit" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}
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
    color: 'black',
  },
  gardenItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
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
});

export default FarmDetail;
