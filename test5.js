const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const mqtt = require('mqtt');

const app = express();
const secretKey = 'ntp';

let temperature = null;
let soilHumidity = null;

let pumpStatus = 'OFF';
let lightStatus = 'OFF';
let fanStatus = 'OFF';

let pumpManualOverride = false;
let lightManualOverride = false;
let fanManualOverride = false;



// Kết nối tới cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'HDSD'
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log('Connected to database');
});

// Kết nối tới MQTT Broker
const mqttClient = mqtt.connect('ws://54.255.244.186:8000/mqtt');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe('esp/temp');
    mqttClient.subscribe('esp/soil');
    mqttClient.subscribe('esp/hum');
    mqttClient.subscribe('esp/rain');

    mqttClient.subscribe('esp/pump');
    mqttClient.subscribe('esp/light');
    mqttClient.subscribe('esp/fan');
});



mqttClient.on('message', (topic, message) => {
    switch (topic) {
        case 'esp/temp':
            temperature = parseFloat(message.toString());
            console.log(`Temperature updated: ${temperature}`);
            break;
        case 'esp/soil':
            soilHumidity = parseFloat(message.toString());
            console.log(`Soil humidity updated: ${soilHumidity}`);
            break;
        case 'esp/pump':
            if(message.toString() === 'on'){
                console.log('ghi de che do thu cong');
                pumpManualOverride = true;
            }
            else if(message.toString() === 'off'){
                console.log('tro lai che do tu dong');
                pumpManualOverride = false;
            }
            pumpStatus = message.toString() === 'on' ? 'ON' : 'OFF';
            console.log(`Pump status updated: ${pumpStatus}`);
            break;
        case 'esp/light':
            if(message.toString() === 'on'){
                console.log('ghi de che do thu cong');
                lightManualOverride = true;
            }
            else if(message.toString() === 'off'){
                console.log('tro lai che do tu dong');
                lightManualOverride = false;
            }
            lightStatus = message.toString() === 'on' ? 'ON' : 'OFF';
            console.log(`Light status updated: ${lightStatus}`);
            break;
        case 'esp/fan':
            if(message.toString() === 'on'){
                console.log('ghi de che do thu cong');
                fanManualOverride = true;
            }
            else if(message.toString() === 'off'){
                console.log('tro lai che do tu dong');
                fanManualOverride = false;
            }
            fanStatus = message.toString() === 'on' ? 'ON' : 'OFF';
            console.log(`Fan status updated: ${fanStatus}`);
            break;
        default:
            console.log(`Unknown topic: ${topic}`);
    }
});


mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

mqttClient.on('offline', () => {
    console.error('MQTT client is offline');
});

mqttClient.on('reconnect', () => {
    console.log('Reconnecting to MQTT Broker');
});

mqttClient.on('close', () => {
    console.log('MQTT connection closed');
});

app.use(express.json());

const publishWithRetain = (topic, message) => {
    mqttClient.publish(topic, message, { qos: 0, retain: true }, function (err) {
        if (!err) {
            console.log(`Published "${message}" to topic "${topic}"`);
        } else {
            console.error('Failed to publish message', err);
        }
    });
};

function processAutomation() {
    const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
    const currentDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    const sql = 'SELECT * FROM automation WHERE is_enabled = 1';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying automation from database:', err);
            return;
        }

        result.forEach(automation => {
            //   const startTime = moment(automation.start_time, 'HH:mm');
            //   const endTime = moment(automation.end_time, 'HH:mm');
            // console.log(currentTime);
            // console.log(currentDate);
            // console.log(currentDate == automation.selected_date);
            if (automation.is_daily) {
                if (!automation.is_check_threshold) {
                    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                if(!lightManualOverride && lightStatus === 'OFF'){
                                  publishWithRetain('esp/light', 'ON');
                                  console.log('Turned on light');
                                  lightStatus = 'ON' ;
                                }
                                break;
                            case 'Bơm':
                                console.log('thiet bi bom bat');
                                console.log(pumpManualOverride);
                                if(!pumpManualOverride && pumpStatus === 'OFF'){
                                  publishWithRetain('esp/pump', 'on');
                                  console.log('Turned on pump');
                                  pumpStatus = 'ON' ;
                                }
                                break;
                            case 'Quạt':
                                 if (!fanManualOverride && fanStatus === 'OFF') {
                                      publishWithRetain('esp/fan', 'ON');
                                      console.log('Turned on fan');
                                      fanStatus = 'ON';
                                  }
                                  break;
                            default:
                                console.log('Unknown device type');
                        }
                    }
                    else {
                      console.log(pumpStatus);
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                if(!lightManualOverride && lightStatus === 'ON'){
                                  publishWithRetain('esp/light', 'OFF');
                                  console.log('Turned off light');
                                  lightStatus = 'OFF';
                                break;          }
                      
                            case 'Bơm':

                                console.log('thiet bi bom tat');
                                console.log(pumpStatus);
                                console.log(!pumpManualOverride);
                                if(!pumpManualOverride && pumpStatus === 'ON'){
                                  publishWithRetain('esp/pump', 'off');
                                  console.log('Turned off pump');
                                  pumpStatus = 'OFF' ;
                                }
                                break;
                            case 'Quạt':
                                if (!fanManualOverride && fanStatus === 'ON') {
                                    publishWithRetain('esp/fan', 'OFF');
                                    console.log('Turned on fan');
                                    fanStatus = 'OFF';
                                }
                                break;
                            default:
                                console.log('Unknown device type');
                        }
                    }
                }
                else {
                    console.log("chan truoc co check nguong");
                    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
                        if (soilHumidity <= automation.lower_threshold_value && automation.type_measure_device === 'soil_humidity' && automation.lower_threshold_value !== '') {
                            mqttClient.publish('esp/pump', 'ON')
                            console.log('Turned on pump')
                        } else if (automation.upper_threshold_value >= soilHumidity && automation.type_measure_device === 'soil_humidity' && automation.upper_threshold_value !== '') {
                            mqttClient.publish('esp/pump', 'OFF')
                            console.log('Turned off pump')
                        } else if (temperature >= automation.upper_threshold_value && automation.type_measure_device === 'temperature' && automation.upper_threshold_value !== '') {
                            mqttClient.publish('esp/fan', 'ON')
                            console.log('Turned on fan')
                        } else if (temperature <= automation.lower_threshold_value && automation.type_measure_device === 'temperature' && automation.lower_threshold_value !== '') {
                            mqttClient.publish('esp/light', 'ON')
                            console.log('Turned on light')
                        }
                    } else {
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                mqttClient.publish('esp/light', 'OFF');
                                console.log('Turned off light')
                                break;
                            case 'Bơm':
                                mqttClient.publish('esp/pump', 'OFF');
                                console.log('Turned off pump');
                                break;
                            case 'Quạt':
                                mqttClient.publish('esp/fan', 'OFF');
                                console.log('Turned of fan');
                                break;
                            default:
                                console.log('Unknown device type');
                        }

                    }
                }
            }
            else{
                console.log("chan truoc truong hop selected_date");
                if(currentDate == automation.selected_date){
                    if (!automation.is_check_threshold) {
                    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                mqttClient.publish('esp/light', 'ON');
                                console.log('Turned on light');
                                break;
                            case 'Bơm':
                                mqttClient.publish('esp/pump', 'ON');
                                console.log('Turned on pump');
                                break;
                            case 'Quạt':
                                mqttClient.publish('esp/fan', 'ON');
                                console.log('Turned on fan');
                                break;
                            default:
                                console.log('Unknown device type');
                        }
                    }
                    else {
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                mqttClient.publish('esp/light', 'OFF');
                                console.log('Turned off light');
                                break;
                            case 'Bơm':
                                mqttClient.publish('esp/pump', 'OFF');
                                console.log('Turned off pump');
                                break;
                            case 'Quạt':
                                mqttClient.publish('esp/fan', 'OFF');
                                console.log('Turned of fan');
                                break;
                            default:
                                console.log('Unknown device type');
                        }
                    }
                }
                else {

                    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
                        if (soilHumidity <= automation.lower_threshold_value && automation.type_measure_device === 'soil_humidity' && automation.lower_threshold_value !== '') {
                            mqttClient.publish('esp/pump', 'ON')
                            console.log('Turned on pump')
                        } else if (automation.upper_threshold_value >= soilHumidity && automation.type_measure_device === 'soil_humidity' && automation.upper_threshold_value !== '') {
                            mqttClient.publish('esp/pump', 'OFF')
                            console.log('Turned off pump')
                        } else if (temperature >= automation.upper_threshold_value && automation.type_measure_device === 'temperature' && automation.upper_threshold_value !== '') {
                            mqttClient.publish('esp/fan', 'ON')
                            console.log('Turned on fan')
                        } else if (temperature <= automation.lower_threshold_value && automation.type_measure_device === 'temperature' && automation.lower_threshold_value !== '') {
                            mqttClient.publish('esp/light', 'ON')
                            console.log('Turned on light')
                        }
                    } else {
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                mqttClient.publish('esp/light', 'OFF');
                                console.log('Turned off light')
                                break;
                            case 'Bơm':
                                mqttClient.publish('esp/pump', 'OFF');
                                console.log('Turned off pump');
                                break;
                            case 'Quạt':
                                mqttClient.publish('esp/fan', 'OFF');
                                console.log('Turned of fan');
                                break;
                            default:
                                console.log('Unknown device type');
                        }

                    }
                }
                } else {
                    console.log("log sai ngay ");
                }
            }

        });

        console.log('Automation processed successfully');
    });
}
