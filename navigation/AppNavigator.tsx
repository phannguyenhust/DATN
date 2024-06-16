import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Main" component={MainTabNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;