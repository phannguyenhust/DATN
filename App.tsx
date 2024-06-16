import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import Dashboard from './src/screens/Dashboard';
import { theme } from './src/core/theme';
import GardenManagementScreen from './src/screens/GardenManagementScreen';
import DetectScreen from './src/screens/DetectScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GardenDetailScreen from './src/screens/GardenDetailScreen';
import Monitor from './src/screens/Monitor';
import TimerScreen from './src/screens/TimerScreen';
import AddGardenScreen from './src/screens/AddGardenScreen';
import { FarmProvider } from './src/context/FarmContext';
import { GardenProvider } from './src/context/GardenContext';
import { TimerProvider } from './src/context/TimerContext';
import AddTimerScreen from './src/screens/AddTimerScreen';
import TimerList from './src/screens/TimerList';
import AddTimer from './src/screens/AddTimer';
import EditTimer from './src/screens/EditTimer';
import Checkbox from './src/screens/Checkbox';
import Toggle from './src/screens/Toggle';
import QRScreen from './src/screens/QRScreen';
import FarmManage from './src/screens/FarmManage';
import AddFarm from './src/screens/AddFarm';
import FarmDetail from './src/screens/FarmDetail';
import AddGarden from './src/screens/AddGarden';
import EditFarm from './src/screens/EditFarm';
import EditGarden from './src/screens/EditGarden';


// import { GardenProvider } from './hooks/useGardens';


const Stack = createStackNavigator();

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <FarmProvider>
        <GardenProvider>
        <TimerProvider>
          <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="GardenManagementScreen" component={GardenManagementScreen} />
            <Stack.Screen name="DetectScreen" component={DetectScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="GardenDetailScreen" component={GardenDetailScreen} />
            <Stack.Screen name="AddGardenScreen" component={AddGardenScreen} />
            <Stack.Screen name="Monitor" component={Monitor} />
            <Stack.Screen name="TimerScreen" component={TimerScreen} />
            <Stack.Screen name="AddTimerScreen" component={AddTimerScreen} />
            <Stack.Screen name="Checkbox" component={Checkbox} />
            <Stack.Screen name="TimerList" component={TimerList} />
            <Stack.Screen name="AddTimer" component={AddTimer} />
            <Stack.Screen name="EditTimer" component={EditTimer} />
            <Stack.Screen name="Toggle" component={Toggle} />
            <Stack.Screen name="QRScreen" component={QRScreen} />
            <Stack.Screen name="FarmManage" component={FarmManage} />
            <Stack.Screen name="AddFarm" component={AddFarm} />
            <Stack.Screen name="FarmDetail" component={FarmDetail} />
            <Stack.Screen name="AddGarden" component={AddGarden} />
            <Stack.Screen name="EditFarm" component={EditFarm} />
            <Stack.Screen name="EditGarden" component={EditGarden} />


          </Stack.Navigator>
          </TimerProvider>
        </GardenProvider>
        </FarmProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;

// // App.tsx
// import * as React from 'react';
// import { View, Text, Image } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Monitor from './screens/Monitor';
// import Detect from './screens/Detect';
// import CameraScreen from './screens/CameraScreen';
// import NewsScreen from './screens/NewsScreen';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen
//           name="Monitor"
//           component={Monitor}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Image 
//               source={require('./assets/line-chart.png')} 
//               style={{width: 30, height: 30}} />
//             ),
//           }}
//         />
//         <Tab.Screen 
//           name="Detect" 
//           component={Detect} 
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Image 
//               source={require('./assets/eye.png')} 
//               style={{width: 30, height: 30}} />
//             ),
//           }}
//           />
//           <Tab.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera' }} />
//           <Tab.Screen name = "News" component = {NewsScreen } options = {{title: 'News'}} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';

// const App = () => {
//   const [scannedData, setScannedData] = useState(null);

//   const onSuccess = (e) => {
//     setScannedData(e.data);
//   };

//   const copyToClipboard = () => {
//     Clipboard.setString(scannedData);
//     Alert.alert('Copied to clipboard');
//   };

//   return (
//     <View style={styles.container}>
//       {!scannedData ? (
//         <QRCodeScanner
//           onRead={onSuccess}
//           flashMode={RNCamera.Constants.FlashMode.auto}
//           topContent={<Text style={styles.centerText}>Scan a QR code</Text>}
//           bottomContent={
//             <TouchableOpacity style={styles.buttonTouchable}>
//               <Text style={styles.buttonText}>OK. Got it!</Text>
//             </TouchableOpacity>
//           }
//         />
//       ) : (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultText}>Scanned Data: {scannedData}</Text>
//           <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
//             <Text style={styles.buttonText}>Copy to Clipboard</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setScannedData(null)} style={styles.scanAgainButton}>
//             <Text style={styles.buttonText}>Scan Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerText: {
//     fontSize: 18,
//     padding: 32,
//     color: '#777',
//   },
//   buttonText: {
//     fontSize: 21,
//     color: 'rgb(0,122,255)',
//   },
//   buttonTouchable: {
//     padding: 16,
//   },
//   resultContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   resultText: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   copyButton: {
//     padding: 10,
//     backgroundColor: 'blue',
//     marginBottom: 10,
//   },
//   scanAgainButton: {
//     padding: 10,
//     backgroundColor: 'green',
//   }
// });

// export default App;
