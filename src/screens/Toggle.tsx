import React, { useState, useEffect, useRef } from 'react';
import { View, Switch, Text } from 'react-native';
import MqttService from '../mqtt/mqttService';

const Toggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mqttService, setMqttService] = useState(null);
  const topicRef = useRef('esp/pump'); // Update the topic to match your device

  useEffect(() => {
    const mqttServiceInstance = new MqttService();
    setMqttService(mqttServiceInstance);
  }, []);

  useEffect(() => {
    if (mqttService) {
      mqttService.subscribeTopic(topicRef.current);
    }
  }, [mqttService]);

  const toggleSwitch = () => {
    setIsEnabled(prevState => {
      const newState =!prevState;
      if (mqttService) {
        mqttService.publishMessage(topicRef.current, newState? 'on' : 'off');
      }
      return newState;
    });
  };

  return (
    <View>
      <Text>Toggle</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default Toggle;