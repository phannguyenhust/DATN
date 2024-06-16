// components/TimerList.tsx

import React from 'react';
import { View, Text, Button, Switch } from 'react-native';
import { useTimers } from '../context/TimerContext';

const TimerList = () => {
  const { timers, removeTimer, updateTimer } = useTimers();

  const toggleEnabled = (id: string) => {
    const timer = timers.find(timer => timer.id === id);
    if (timer) {
      updateTimer(id, { ...timer, isEnabled: !timer.isEnabled });
    }
  };

  return (
    <View>
      {timers.map(timer => (
        <View key={timer.id} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <View>
            <Text>{timer.type}</Text>
            <Text>Bắt đầu: {timer.startTime}</Text>
            <Text>Kết thúc: {timer.endTime}</Text>
            {timer.hasThreshold && <Text>Ngưỡng: {timer.thresholdValue}</Text>}
          </View>
          <Switch
            onValueChange={() => toggleEnabled(timer.id)}
            value={timer.isEnabled}
          />
          <Button title="Remove" onPress={() => removeTimer(timer.id)} />
        </View>
      ))}
    </View>
  );
};

export default TimerList;
