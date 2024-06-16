import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const options = {
  host: "54.255.244.186",
  port: 8000,
  path: "/mqtt"
};

class MqttService {
  constructor() {
    this.client = new Paho.MQTT.Client(
      `ws://${options.host}:${options.port}${options.path}`,
      'id_' + Math.random().toString(16).substr(2, 8)
    );
    this.isConnected = false;
  }

  connect = (onSuccessCallback) => {
    if (!this.isConnected) {
      this.client.connect({
        onSuccess: () => {
          this.isConnected = true;
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
        useSSL: false,
        timeout: 3,
        onFailure: this.onFailure,
      });
    } else {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  };

  disconnect = () => {
    if (this.isConnected) {
      this.client.disconnect();
      this.isConnected = false;
    }
  };

  onFailure = (err) => {
    console.error("MQTT Connection failed:", err);
  };

  onMessageArrived = (callback) => {
    this.client.onMessageArrived = (message) => {
      const topic = message.destinationName;
      let payload = message.payloadString;
      try {
        payload = JSON.parse(payload); // Giải mã JSON nếu có thể
      } catch (e) {
        // Nếu không phải JSON, giữ nguyên payload string
      }
      callback(topic, payload);
    };
  };
  

  onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      this.isConnected = false;
    }
  };

  subscribeTopic = (topic) => {
    if (this.isConnected) {
      this.client.subscribe(topic, { qos: 0 });
    } else {
      console.error('Cannot subscribe, MQTT client is not connected');
    }
  };

  sendMessage = (topic, payload, options = {}) => {
    if (this.isConnected) {
      let message = new Paho.MQTT.Message(JSON.stringify(payload));
      console.log(message);
      message.destinationName = topic;
      if (options.retain) {
        message.retained = options.retain;
      }
      if (options.qos) {
        message.qos = options.qos;
      }
      this.client.send(message);
    } else {
      console.error('Cannot send message, MQTT client is not connected');
    }
  };


  getClient() {
    return this.client;
  }

  isConnected() {
    return this.isConnected;
  }
}

export default MqttService;
