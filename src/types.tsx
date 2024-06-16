import { RouteProp } from '@react-navigation/native';

export type TimerListRouteProp = {
  TimerList: {
    deviceId: string;
  };
};

export type Navigation = {
  navigate: (scene: string) => void;
};

export interface Garden {
  id: string;
  nameGarden: string;
  deviceId: string;
  datePlanting: string;
  image: any;
}

export interface GardenContextType {
  gardens: Garden[];
  addGarden: (garden: Garden) => void;
  deviceId: string; // Thêm deviceId vào GardenContextType
  setDeviceId: (deviceId: string) => void; // Hàm cập nhật deviceId
}

// types.ts

export interface Timer {
  id: string;
  device_id: string;
  type_control_device: string;
  start_time: string;
  end_time: string;
  is_daily: boolean;
  selected_date: string | null;
  is_check_threshold: boolean;
  type_measure_device: string | null;
  lower_threshold_value: string | null;
  upper_threshold_value: string | null;
  is_enabled: boolean; //toggle
}

export interface TimerContextType {
  timers: Timer[];
  addTimer: (timer: Timer) => void;
  removeTimer: (id: string) => void;
  updateTimer: (id: string, updatedTimer: Timer) => void;
}

export interface Farm {
  idFarm: number;
  nameFarm: string;
  addressFarm: string;
}
