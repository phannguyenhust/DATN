import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFarms } from '../context/FarmContext';
import { Picker } from '@react-native-picker/picker';

interface Province {
  id: number;
  name: string;
}

const AddFarm: React.FC = () => {
  const [nameFarm, setNameFarm] = useState('');
  const [addressFarm, setAddressFarm] = useState('');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const { addFarm } = useFarms();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('http://18.139.83.15:3000/api/provinces');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleSave = async () => {
    if (!nameFarm || !selectedProvince) {
      alert('Please enter farm name and select a province');
      return;
    }

    try {
      const response = await fetch('http://18.139.83.15:3000/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameFarm, addressFarm: selectedProvince }),
      });

      if (!response.ok) {
        throw new Error('Error saving farm');
      }

      const newFarm = await response.json();
      addFarm(newFarm); // Add the new farm to the context
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error saving farm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập tên nông trại:</Text>
      <TextInput
        style={styles.input}
        value={nameFarm}
        onChangeText={setNameFarm}
        placeholder="Enter farm name"
      />
      <Text style={styles.label}>Chọn địa chỉ nông trại</Text>
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(itemValue) => setSelectedProvince(itemValue)}
      >
        {provinces.map((province) => (
          <Picker.Item key={province.id} label={province.name} value={province.id} />
        ))}
      </Picker>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    color: 'black',
  },
});

export default AddFarm;
