import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const MonitorBackground = ({ children }: Props) => (
  <ImageBackground
    source={require('../assets/topVector.png')} // Use a different background image for the monitor
    resizeMode="cover"
    style={styles.background}
  >
    <View style={styles.container}>
      {children}
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: '#white', // Temporary color to see if the style is applied
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  

export default memo(MonitorBackground);
