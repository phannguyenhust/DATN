import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface RouteParams {
  farmId: number;
  nameFarm: string;
  addressFarm: string;
}

const EditFarm: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { farmId, nameFarm, addressFarm } = route.params;
  const navigation = useNavigation();

  const [name, setName] = useState(nameFarm);
  const [address, setAddress] = useState(addressFarm);

  const handleSave = async () => {
    const updatedFarm = {
      nameFarm: name,
      addressFarm: address,
    };

    try {
      const response = await fetch(`http://18.139.83.15:3000/api/farms/${farmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFarm),
      });
      if (!response.ok) {
        throw new Error('Failed to update farm');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error updating farm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Farm</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Farm Name"
      />
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Farm Address"
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
    color: 'black',
  },
});

export default EditFarm;
