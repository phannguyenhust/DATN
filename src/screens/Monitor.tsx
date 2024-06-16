
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Switch, Dimensions, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert, Button, Image } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import MqttService from '../mqtt/mqttService.js';
// import DatePicker from 'react-native-date-picker';
// import { BottomSheet } from '@rneui/themed';
// import axios from 'axios';
// import BackButton from '../components/BackButton';
// import { useNavigation } from '@react-navigation/native';
// import moment from 'moment';
// import { useGardens } from '../context/GardenContext'; // Import hook from context

// import { Navigation } from '../types';

// type Props = {
//   navigation: Navigation;
// };


// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// const mqttService = new MqttService();

// const data = {
//   labels: ["0"],
//   datasets: [
//     {
//       data: [0],
//     },
//   ],
// };

// function Monitor({ route }) {
  

//   const navigation = useNavigation();
//   // const { addGarden, deviceId, setDeviceId } = useGardens(); // Use context hook
//   const temperatureTopicRef = useRef('');
//   const humTopicRef = useRef('');
//   const soilTopicRef = useRef('');
//   const rainTopicRef = useRef('');
//   const pumpTopicRef = useRef('');
//   const fanTopicRef = useRef('');
//   const lightTopicRef = useRef('');



//   const [forecast, setForecast] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [temperature, setTemperature] = React.useState(Number);
//   const [humidity, setHumidity] = React.useState(Number);

//   const [chartTemperature, setChartTemperature] = React.useState(data);
//   const [chartHumidity, setChartHumidity] = React.useState(data);
  
//   const [timeStamps, setTimeStamps] = React.useState([]);
//   const [pumpState, setPumpState] = React.useState(false);
//   const [fanState, setFanState] = React.useState(false);
//   const [lightState, setLightState] = React.useState(false);
//   const [thresholdPump, setThresholdPump] = React.useState(0);
//   const [thresholdInputPump, setThresholdInputPump] = React.useState('');
//   const [thresholdFan, setThresholdFan] = React.useState(0);
//   const [thresholdInputFan, setThresholdInputFan] = React.useState('');
//   const [pumpButtonDisabled, setPumpButtonDisabled] = React.useState(false);
//   const [fanButtonDisabled, setFanButtonDisabled] = React.useState(false);
//   const [lightButtonDisabled, setLightButtonDisabled] = React.useState(false);
//   const [pumpCountdown, setCountdown] = React.useState(3);
//   const [fanCountdown, setFanCountdown] = React.useState(3);
//   const [lightCountdown, setLightCountdown] = React.useState(3);

//   const [timePumpStart, setTimePumpStart] = React.useState(new Date());
//   const [timeFanStart, setTimeFanStart] = React.useState(new Date());
//   const [timeLightStart, setTimeLightStart] = React.useState(new Date());
//   const [timeLightEnd, setTimeLightEnd] = React.useState(new Date());
//   const [isVisiblePumpStart, setIsVisiblePumpStart] = useState(false);
//   const [isVisibleFanStart, setIsVisibleFanStart] = useState(false);
//   const [isVisibleLightStart, setIsVisibleLightStart] = useState(false);
//   const [isVisibleLightEnd, setIsVisibleLightEnd] = useState(false);

//   const [temperatureTopic, setTemperatureTopic] = useState('');
//   const [humidityTopic, setHumidityTopic] = useState('');
//   const [soilTopic, setSoilTopic] = useState('');
//   const [rainTopic, setRainTopic] = useState('');

//   const [nameGarden, setNameGarden] = useState('');
//   const [countDay, setCountDay] = useState(0);

//   const mqttServiceRef = useRef(null);
//   const [mqttConnected, setMqttConnected] = useState(false);

//   const [deviceId, setDeviceId] = useState('');

//   const nav = useNavigation();
  

//   useEffect(() => {
//     const { deviceId, datePlanting, nameGarden } = route.params;
//     console.log(route.params);
//     setDeviceId(deviceId);
//     setNameGarden(nameGarden);
//     const temperatureTopic = `${deviceId}/temp`;
//     const humidityTopic = `${deviceId}/hum`;
//     const soilTopic = `${deviceId}/dat`;
//     const rainTopic = `${deviceId}/mua`;
//     const pumpTopic = `${deviceId}/pump`;
//     const fanTopic = `${deviceId}/fan`;
//     const lightTopic = `${deviceId}/light`;

//     temperatureTopicRef.current = temperatureTopic;
//     humTopicRef.current = humidityTopic;
//     soilTopicRef.current = soilTopic;
//     rainTopicRef.current = soilTopic;
//     pumpTopicRef.current = pumpTopic;
//     fanTopicRef.current = fanTopic;
//     lightTopicRef.current = lightTopic;


//     setTemperatureTopic(temperatureTopic);
//     setHumidityTopic(humidityTopic);
//     setSoilTopic(soilTopic);
//     setRainTopic(rainTopic);

//     // Thực hiện các thao tác cần thiết với các chủ đề MQTT ở đây

//     // Ví dụ:
//     console.log('Temperature Topic:', temperatureTopic);
//     console.log('Humidity Topic:', humidityTopic);
//     console.log('Soil Topic:', soilTopic);
//     console.log('Rain Topic:', rainTopic);

//     // Đặt up MQTT subscription ở đây nếu cần
//     const days = moment().diff(moment(datePlanting, 'DD/MM/YYYY'), 'days') + 1 ;
//     setCountDay(days);
//     // Hủy subscription khi component unmount
//     return () => {
//       // Hủy subscription MQTT ở đây nếu cần
//     };
//   }, [route.params]);

//   //Save
//   useEffect(() => {
//     console.log('đang log để test');
//     // Access the value of temperatureTopicRef
//     console.log(temperatureTopicRef.current);
//   }, []);

// //   useEffect(() => {
// //     if (deviceId) {
// //         // Thiết lập topic MQTT dựa trên deviceId
// //         const topic = `${deviceId}/temp`;
// //         setTemperatureTopic(topic);
// //         console.log(temperatureTopic);
// //     }
// // }, [deviceId]);
// const togglePump = () => {
//   setPumpState(prevState => {
//     const newState = !prevState;
//     publishMessage(pumpTopicRef.current, newState ? 'on' : 'off');
//     return newState;
//   });
// };

// const toggleFan = () => {
//   setFanState(prevState => {
//     const newState = !prevState;
//     publishMessage(fanTopicRef.current, newState ? 'on' : 'off');
//     return newState;
//   });
// };

// const toggleLight = () => {
//   setLightState(prevState => {
//     const newState = !prevState;
//     publishMessage(lightTopicRef.current, newState ? 'on' : 'off');
//     return newState;
//   });
// };


// useEffect(() => {
//   const fetchWeather = async () => {
//     try {
//       const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
//         params: {
//           q: 'Hanoi', // Tên thành phố
//           appid: 'c7708c477d2f608c10981f970fbba909', // Thay YOUR_API_KEY bằng API key của bạn
//           units: 'metric' // Đơn vị nhiệt độ (Celsius)
//         }
//       });
//       setForecast(response.data.list);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   fetchWeather();
// }, []);


// const getWeatherIcon = (description : any) => {
//   switch (description) {
//     case 'clear sky':
//       return require('../assets/sun.png');
//     case 'few clouds':
//     case 'scattered clouds':
//     case 'broken clouds':
//       return require('../assets/cloudy.png');
//     case 'shower rain':
//     case 'rain':
//       return require('../assets/rainy-day.png');
//     case 'thunderstorm':
//       return require('../assets/storm.png');
//     case 'snow':
//       return require('../assets/snow.png');
//     case 'mist':
//       return require('../assets/mist.png');
//     default:
//       return require('../assets/sun.png');
//   }
// };
// // console.log(getWeatherIcon('mist'))

// const renderForecast = () => {
//   return forecast.map((item : any, index : any) => (
//     <View key={index} style={styles.forecastItem}>
//       <Text style={styles.forecastTime}>{item.dt_txt}</Text>
//       <Image source={getWeatherIcon(item.weather[0].description)} style={{width: 30, height: 30}} />
//       <Text style={styles.forecastText}>Temp: {item.main.temp}°C</Text>
//       <Text style={styles.forecastText}>Humidity: {item.main.humidity}%</Text>
//     </View>
//   ));
// };

// useEffect(() => {
//   console.log("1: "+ temperatureTopic);
//   const temp = `${deviceId}/temp`;
//   setTemperatureTopic(temp);
//   console.log('2: ' + temperatureTopic);

//   const hum = `${deviceId}/hum`;
//   setHumidityTopic(hum);
//   console.log('2: ' + humidityTopic);

//   const mqttService = new MqttService();
//   mqttServiceRef.current = mqttService;

//   const onConnect = () => {
//     console.log('Connected to MQTT broker');
//     setMqttConnected(true);

//     mqttService.subscribeTopic(temperatureTopicRef.current);
//     mqttService.subscribeTopic(humTopicRef.current);
//     mqttService.subscribeTopic(pumpTopicRef.current);
//     mqttService.subscribeTopic(fanTopicRef.current);
//     mqttService.subscribeTopic(lightTopicRef.current);
    
//       // Gửi yêu cầu lấy trạng thái máy bơm từ MQTT
//     mqttService.sendMessage(pumpTopicRef.current, 'getStatus');
//     mqttService.sendMessage(fanTopicRef.current, 'getStatus');
//     mqttService.sendMessage(lightTopicRef.current, 'getStatus');
    


//   };

//   const onConnectionLost = (responseObject) => {
//     if (responseObject.errorCode !== 0) {
//       console.log("onConnectionLost:" + responseObject.errorMessage);
//       setMqttConnected(false);
//       setTimeout(() => {
//         mqttService.connect(onConnect);
//       }, 5000);
//     }
//   };

  


//   const onDataReceived = (topic, payload) => {
//     const time = new Date().toLocaleTimeString('vi-VN', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

//     if(topic === pumpTopicRef.current){
//       if (payload === 'on') {
//         setPumpState(true);
//       } else if (payload === 'off') {
//         setPumpState(false);
//       }
//     }
//     if(topic === fanTopicRef.current){
//       if (payload === 'on') {
//         setFanState(true);
//       } else if (payload === 'off') {
//         setFanState(false);
//       }
//     }
//     if(topic === lightTopicRef.current){
//       if (payload === 'on') {
//         setLightState(true);
//       } else if (payload === 'off') {
//         setLightState(false);
//       }
//     }

//     if (topic === temperatureTopicRef.current) {
//       setTemperature(parseFloat(payload));
//       setChartTemperature(prevData => {
//         const newLabels = [...prevData.labels];
//         const newData = [...prevData.datasets[0].data];
//         newLabels.push(time);
//         newData.push(parseFloat(payload));
//         if (newLabels.length > 6) {
//           newLabels.shift();
//           newData.shift();
//         }
//         return {
//           labels: newLabels,
//           datasets: [{ data: newData }],
//         };
//       });
//     } else if (topic === humTopicRef.current) {
//       setHumidity(parseFloat(payload));
//       setChartHumidity(prevData => {
//         const newLabels = [...prevData.labels];
//         const newData = [...prevData.datasets[0].data];
//         newLabels.push(time);
//         newData.push(parseFloat(payload));
//         if (newLabels.length > 5) {
//           newLabels.shift();
//           newData.shift();
//         }
//         return {
//           labels: newLabels,
//           datasets: [{ data: newData }],
//         };
//       });
//     }
//   };

//   mqttService.connect(onConnect);
//   mqttService.onMessageArrived(onDataReceived);
//   mqttService.client.onConnectionLost = onConnectionLost;

//   return () => {
//     mqttService.disconnect();
//   };
// }, [deviceId]);

// const publishMessage = (topic, message) => {
//   if (mqttConnected) {
//     mqttServiceRef.current.sendMessage(topic, message);
//     console.log(topic, message);
//   } else {
//     console.error('MQTT client is not connected');
//   }
// };



import React, { useEffect, useRef, useState } from 'react';
import { View, Switch, Dimensions, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MqttService from '../mqtt/mqttService.js';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import MonitorBackground from '../components/MonitorBackground';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const data = {
  labels: ["0"],
  datasets: [
    {
      data: [0],
    },
  ],
};

function Monitor({ route }) {
  const navigation = useNavigation();
  const temperatureTopicRef = useRef('');
  const humTopicRef = useRef('');
  const soilTopicRef = useRef('');
  const rainTopicRef = useRef('');
  const pumpTopicRef = useRef('');
  const fanTopicRef = useRef('');
  const lightTopicRef = useRef('');

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(Number);
  const [humidity, setHumidity] = useState(Number);
  const [chartTemperature, setChartTemperature] = useState(data);
  const [chartHumidity, setChartHumidity] = useState(data);
  const [pumpState, setPumpState] = useState(false);
  const [fanState, setFanState] = useState(false);
  const [lightState, setLightState] = useState(false);
  const [nameGarden, setNameGarden] = useState('');
  const [countDay, setCountDay] = useState(0);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const mqttServiceRef = useRef(null);

  const nav = useNavigation(); // Sử dụng hook useNavigation


  useEffect(() => {
    const { deviceId, datePlanting, nameGarden } = route.params;
    setDeviceId(deviceId);
    setNameGarden(nameGarden);

    const temperatureTopic = `${deviceId}/temp`;
    const humidityTopic = `${deviceId}/hum`;
    const soilTopic = `${deviceId}/dat`;
    const rainTopic = `${deviceId}/mua`;
    const pumpTopic = `${deviceId}/pump`;
    const fanTopic = `${deviceId}/fan`;
    const lightTopic = `${deviceId}/light`;

    temperatureTopicRef.current = temperatureTopic;
    humTopicRef.current = humidityTopic;
    soilTopicRef.current = soilTopic;
    rainTopicRef.current = rainTopic;
    pumpTopicRef.current = pumpTopic;
    fanTopicRef.current = fanTopic;
    lightTopicRef.current = lightTopic;

    const days = moment().diff(moment(datePlanting, 'YYYY-MM-DD'), 'days') + 1;
    setCountDay(days);

    // Initialize MQTT service only once
    if (!mqttServiceRef.current) {
      const mqttService = new MqttService();
      mqttServiceRef.current = mqttService;

      const onConnect = () => {
        console.log('Connected to MQTT broker');
        setMqttConnected(true);

        mqttService.subscribeTopic(temperatureTopicRef.current);
        mqttService.subscribeTopic(humTopicRef.current);
        mqttService.subscribeTopic(pumpTopicRef.current);
        mqttService.subscribeTopic(fanTopicRef.current);
        mqttService.subscribeTopic(lightTopicRef.current);

        // mqttService.sendMessage(pumpTopicRef.current, 'getStatus');
        // mqttService.sendMessage(fanTopicRef.current, 'getStatus');
        // mqttService.sendMessage(lightTopicRef.current, 'getStatus');
      };

      const onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
          setMqttConnected(false);
          setTimeout(() => {
            mqttService.connect(onConnect);
          }, 5000);
        }
      };

      const onDataReceived = (topic, payload) => {
        const time = new Date().toLocaleTimeString('vi-VN', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      
        if (topic === pumpTopicRef.current && payload.isFromAutomation == false) {
          setPumpState(payload.message === 'on');
        }
        if (topic === fanTopicRef.current && payload.isFromAutomation == false) {
          setFanState(payload.message === 'on');
        }
        if (topic === lightTopicRef.current && payload.isFromAutomation == false) {
          setLightState(payload.message === 'on');
        }
        if (topic === temperatureTopicRef.current) {
          setTemperature(parseFloat(payload));
          setChartTemperature(prevData => {
            const newLabels = [...prevData.labels, time];
            const newData = [...prevData.datasets[0].data, parseFloat(payload)];
            if (newLabels.length > 6) {
              newLabels.shift();
              newData.shift();
            }
            return { labels: newLabels, datasets: [{ data: newData }] };
          });
        } else if (topic === humTopicRef.current) {
          setHumidity(parseFloat(payload));
          setChartHumidity(prevData => {
            const newLabels = [...prevData.labels, time];
            const newData = [...prevData.datasets[0].data, parseFloat(payload)];
            if (newLabels.length > 5) {
              newLabels.shift();
              newData.shift();
            }
            return { labels: newLabels, datasets: [{ data: newData }] };
          });
        }
      };
      

      mqttService.connect(onConnect);
      mqttService.onMessageArrived(onDataReceived);
      mqttService.client.onConnectionLost = onConnectionLost;

      return () => {
        mqttService.disconnect();
      };
    }
  }, [route.params]);



  // Hàm gửi tin nhắn với retain
const publishWithRetain = (topic, message) => {
  if (mqttServiceRef.current) {
    mqttServiceRef.current.sendMessage(topic, message, { retain: true });
    console.log("đã set xong retain true");
  }
};

// Cập nhật hàm publishMessage
const publishMessage = (topic, message) => {
  if (mqttConnected) {
    publishWithRetain(topic, { message }); // Đóng gói payload như đối tượng JSON
    console.log(topic, message);
  } else {
    console.error('MQTT client is not connected');
  }
};


const togglePump = () => {
  setPumpState(prevState => {
    const newState = !prevState;
    publishMessage(pumpTopicRef.current, newState ? 'on' : 'off', { retain: true });
    return newState;
  });
};


  const toggleFan = () => {
    setFanState(prevState => {
      const newState = !prevState;
      publishMessage(fanTopicRef.current, newState ? 'on' : 'off');
      return newState;
    });
  };

  const toggleLight = () => {
    setLightState(prevState => {
      const newState = !prevState;
      publishMessage(lightTopicRef.current, newState ? 'on' : 'off');
      return newState;
    });
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            q: 'Hanoi',
            appid: 'c7708c477d2f608c10981f970fbba909',
            units: 'metric'
          }
        });
        setForecast(response.data.list);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (description) => {
    switch (description) {
      case 'clear sky':
        return require('../assets/sun.png');
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return require('../assets/cloudy.png');
      case 'shower rain':
      case 'rain':
        return require('../assets/rainy-day.png');
      case 'thunderstorm':
        return require('../assets/storm.png');
      case 'snow':
        return require('../assets/snow.png');
      case 'mist':
        return require('../assets/mist.png');
      default:
        return require('../assets/sun.png');
    }
  };

  const renderForecast = () => {
    return forecast.map((item, index) => (
      <View key={index} style={styles.forecastItem}>
        <Text style={styles.forecastTime}>{item.dt_txt}</Text>
        <Image source={getWeatherIcon(item.weather[0].description)} style={{ width: 30, height: 30 }} />
        <Text style={styles.forecastText}>Temp: {item.main.temp}°C</Text>
        <Text style={styles.forecastText}>Humidity: {item.main.humidity}%</Text>
      </View>
    ));
  };

  return (
    <MonitorBackground>
      <View style={styles.container}>
      <BackButton goBack={() => nav.goBack()} />
      <Text style = {styles.title}> {nameGarden} </Text>
      <Text style = {{color: '#7FFF00', fontSize: 30, fontWeight: 'bold',}}> Day {countDay}</Text>
      <ScrollView>
        {loading ? (
            <Text style={styles.loadingText}>Loading weather...</Text>
          ) : (
            <View style={styles.weatherSection}>
              <Text style={styles.weatherTitle}>Dự báo thời tiết</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherContainer}>
                {renderForecast()}
              </ScrollView>
            </View>
          )}
        

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Temperature</Text>
          <LineChart
            data={chartTemperature}
            width={screenWidth * 0.9}
            height={screenHeight * 0.3}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero={true}
            yAxisSuffix={"°C"}

          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Humidity</Text>
          <LineChart
            data={chartHumidity}
            width={screenWidth * 0.9}
            height={screenHeight * 0.3}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero={true}
            yAxisSuffix={"%"}
          />
        </View>
        <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Bơm</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={pumpState ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={togglePump}
          value={pumpState}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Quạt</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={fanState ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleFan}
          value={fanState}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Đèn</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={lightState ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLight}
          value={lightState}
        />
      </View>

    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
      <TouchableOpacity style={{flex: 1, marginHorizontal: 5}} onPress={() => navigation.navigate('TimerList', {deviceId: deviceId})}>
        <Text style={{color: 'black', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Cài theo thời gian</Text>
      </TouchableOpacity>
    </View>


       

      </ScrollView>
    </View>
    </MonitorBackground>
    
  );
};
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(100, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7FFF00',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  buttonContainer: {
    width: screenWidth * 0.9,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: screenWidth * 0.8,
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    textAlign: 'right'
  },
  buttonText: {
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: '#90EE90', // Green color when active
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.9,
    marginBottom: 10
  },
  input: {
    height: 40,
    width: '30%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dateTimePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimePickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: '#90EE90', // Green color for Confirm button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#DDDDDD', // Gray color for Cancel button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  bottomSheetContainer: {
    justifyContent: 'center',
  },
  setTimeContainer: {
    padding: 10,
    // justifyContent: 'center',
    flexDirection: 'row',
    width: screenWidth * 0.8,
    justifyContent: 'space-between'
  },
  textSetTime: {
    fontSize: 16,
    textAlign: 'left',
    padding: 10,
    color: 'black',
  },
  buttonSetTime: {
    backgroundColor: '#90EE90', // Green color for Confirm button
    padding: 10,
    borderRadius: 5,
  },
  weatherSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#EFEFEF',
    flexDirection: 'row',
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000', // Màu chữ đậm để dễ nhìn
    textAlign: 'center',
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 30, // Tăng khoảng cách giữa các mục dự báo
  },
  forecastTime: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000', // Màu chữ đậm để dễ nhìn
  },
  forecastText: {
    fontSize: 14,
    color: '#000', // Màu chữ đậm để dễ nhìn
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#000', // Màu chữ đậm để dễ nhìn
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: 'black',
  },

});
export default Monitor;
