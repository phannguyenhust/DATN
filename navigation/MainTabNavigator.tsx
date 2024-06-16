// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
// import SettingsScreen from '../screens/SettingsScreen';

// const Tab = createBottomTabNavigator();

// const MainTabNavigator = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// };

// export default MainTabNavigator;

import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Monitor from '../screens/Monitor';
import Detect from '../screens/Detect';
import CameraScreen from '../screens/CameraScreen';
import NewsScreen from '../screens/NewsScreen';



const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Monitor"
          component={Monitor}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image 
              source={require('./assets/line-chart.png')} 
              style={{width: 30, height: 30}} />
            ),
          }}
        />
        <Tab.Screen 
          name="Detect" 
          component={Detect} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image 
              source={require('./assets/eye.png')} 
              style={{width: 30, height: 30}} />
            ),
          }}
          />
          <Tab.Screen name = "News" component = {NewsScreen } options = {{title: 'News'}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainTabNavigator;