// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const _onSignUpPressed = async () => {
    try {
      const response = await fetch('http://18.139.83.15:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Registered Success');
        navigation.navigate('LoginScreen');
      } else {
        setError(data.error);
        Alert.alert('Email or Password invalid');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Internal server error');
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <Logo />

      <Header>Create Account</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={setEmail}
        error={false} // always false for registration
        errorText=""
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={setPassword}
        error={false} // always false for registration
        errorText=""
        secureTextEntry
      />

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        Sign Up
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
  },
  link: {
    marginTop: 12,
    color: theme.colors.primary,
  },
  error: {
    marginTop: 12,
    color: 'red',
  },
});

export default RegisterScreen;