import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface RouteParams {
  gardenId: number;
  nameGarden: string;
  deviceId: string;
  datePlanting: string;
}

const EditGarden: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { gardenId, nameGarden, deviceId, datePlanting } = route.params;
  const navigation = useNavigation();

  const [name, setName] = useState(nameGarden);
  const [device, setDevice] = useState(deviceId);
  const [date, setDate] = useState(datePlanting);

  const handleSave = async () => {
    const updatedGarden = {
      nameGarden: name,
      deviceId: device,
      datePlanting: date,
    };

    try {
      const response = await fetch(`http://18.139.83.15:3000/api/gardens/${gardenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGarden),
      });
      if (!response.ok) {
        throw new Error('Failed to update garden');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error updating garden:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Garden</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Garden Name"
      />
      <TextInput
        style={styles.input}
        value={device}
        onChangeText={setDevice}
        placeholder="Device ID"
      />
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Date Planting"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    color: 'black'
  },
});

export default EditGarden;
