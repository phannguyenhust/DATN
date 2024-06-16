// TimerContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Timer, TimerContextType } from '../types';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([]);

  const addTimer = (timer: Timer) => {
    setTimers([...timers, timer]);
  };

  const removeTimer = (id: string) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  const updateTimer = (id: string, updatedTimer: Timer) => {
    setTimers(timers.map(timer => (timer.id === id ? updatedTimer : timer)));
  };

  const contextValue: TimerContextType = {
    timers,
    addTimer,
    setTimers,
    removeTimer,
    updateTimer,
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
};
