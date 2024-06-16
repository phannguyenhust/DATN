import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Checkbox = () => {
  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);

  const handleMalePress = () => {
    setMale(!male);
    setFemale(false);
  };

  const handleFemalePress = () => {
    setFemale(!female);
    setMale(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gender:</Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, male ? styles.checked : styles.unchecked]}
          onPress={handleMalePress}
        >
          <Text style={styles.text}>Male</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, female ? styles.checked : styles.unchecked]}
          onPress={handleFemalePress}
        >
          <Text style={styles.text}>Female</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  unchecked: {
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
  },
});

export default Checkbox;