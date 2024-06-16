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

let menualOverride = false;

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
            if(message.toString === 'on'){
                manualOverride = true;
            }
            pumpStatus = message.toString() === 'on' ? 'ON' : 'OFF';
            console.log(`Pump status updated: ${pumpStatus}`);
            break;
        case 'esp/light':
            lightStatus = message.toString() === 'on' ? 'ON' : 'OFF';
            console.log(`Light status updated: ${lightStatus}`);
            break;
        case 'esp/fan':
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
    if(manualOverride){
        console.log('chế độ thủ công đang được bật');
        return;
    }
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
                                if(lightStatus === 'OFF'){
                                  publishWithRetain('esp/light', 'ON');
                                  console.log('Turned on light');
                                  lightStatus = 'ON' ;
                                }
                                break;
                            case 'Bơm':
                                if(pumpStatus === 'OFF'){
                                  publishWithRetain('esp/pump', 'ON');
                                  console.log('Turned on pump');
                                  pumpStatus = 'ON' ;
                                }
                                break;
                            case 'Quạt':
                                 if (fanStatus === 'OFF') {
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
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                if(lightStatus === 'ON'){
                                  publishWithRetain('esp/light', 'OFF');
                                  console.log('Turned off light');
                                  lightStatus = 'OFF';
                                }
                                break;
                            case 'Bơm':
                                if(pumpStatus === 'ON'){
                                  publishWithRetain('esp/pump', 'OFF');
                                  console.log('Turned off pump');
                                  pumpStatus = 'OFF' ;
                                }
                                break;
                            case 'Quạt':
                                if (fanStatus === 'ON') {
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


function handleAutomation(automation) {
    if (automation.is_check_threshold) {
        switch (automation.type_control_device) {
            case 'Đèn':
                mqttClient.publish('light', 'ON');
                console.log('Turned on light');
                break;
            case 'Bơm':
                console.log("Case bat bom");
                controlPump(automation);
                break;
            case 'Quạt':
                controlFan(automation);
                break;
            default:
                console.log('Unknown device type');
        }
    } else {
        switch (automation.type_control_device) {
            case 'Đèn':
                mqttClient.publish('light', 'ON');
                console.log('Turned on light');
                break;
            case 'Bơm':
                mqttClient.publish('pump', 'ON');
                console.log('Turned on pump');
                break;
            case 'Quạt':
                mqttClient.publish('fan', 'ON');
                console.log('Turned on fan');
                break;
            default:
                console.log('Unknown device type');
        }
    }
}

function controlPump(automation) {
    console.log(soilHumidity);
    console.log(automation.threshold);
    if (automation.type_measure_device === "soil_humidity") {
        if (automation.type_threshold === "upper" && soilHumidity > automation.threshold_value) {
            mqttClient.publish('esp/pump', 'ON');
            console.log('Turned on pump based on soil humidity (upper threshold)');
        } else if (automation.type_threshold === "lower" && soilHumidity < automation.threshold_value) {
            mqttClient.publish('esp/pump', 'OFF');
            console.log('Turned off pump based on soil humidity (lower threshold)');
        }
    } else {
        console.log('Unknown measurement device for pump');
    }
}

function controlFan(automation) {
    if (automation.type_measure_device === "temperature") {
        if (automation.type_threshold === "upper" && temperature > automation.threshold_value) {
            mqttClient.publish('fan', 'ON');
            console.log('Turned on fan based on temperature (upper threshold)');
        } else if (automation.type_threshold === "lower" && temperature < automation.threshold_value) {
            mqttClient.publish('fan', 'OFF');
            console.log('Turned off fan based on temperature (lower threshold)');
        }
    } else {
        console.log('Unknown measurement device for fan');
    }
}

// Set interval timer to call processAutomation every 5 seconds
setInterval(processAutomation, 5000);




// Tạo một endpoint để tạo một người dùng mới
app.post('/api/user', (req, res) => {
    const { email, password } = req.body;
    const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

// Tạo endpoint đăng nhập để xác thực người dùng
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            throw err;
        }
        if (result.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result[0];
        try {
            if (password !== user.password) {
                console.log('Password does not match');
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            console.log('Password matches');
            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (compareError) {
            console.error('Error comparing passwords with bcrypt:', compareError);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Tạo một endpoint để thêm một vườn mới
app.post('/api/gardens', (req, res) => {
    const { nameGarden, deviceId, datePlanting } = req.body;
    console.log('Received data:', req.body); // Log dữ liệu nhận được từ client




    const sql = 'INSERT INTO gardens (nameGarden, deviceId, datePlanting) VALUES (?, ?, ?)';
    console.log('SQL INSERT:', sql);

    db.query(sql, [nameGarden, deviceId, datePlanting], (err, result) => {
        if (err) {
            console.error('Error inserting garden:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log('Inserted data:', [nameGarden, deviceId, datePlanting]);
        res.status(201).json({ message: 'Garden added successfully' });
    });
});

//garden
app.get('/api/gardens', (req, res) => {
    const sql = 'SELECT idGarden, nameGarden, deviceId, DATE_FORMAT(datePlanting, \'%Y-%m-%d\') AS datePlanting FROM gardens';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying gardens from database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(result);
    });
});

//
// Tạo một endpoint để xóa vườn dựa vào deviceId
app.delete('/api/gardens/:deviceId', (req, res) => {
    const deviceId = req.params.deviceId;

    const sql = 'DELETE FROM gardens WHERE deviceId = ?';
    console.log('SQL DELETE:', sql);

    db.query(sql, [deviceId], (err, result) => {
        if (err) {
            console.error('Error deleting garden:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log('Deleted garden with deviceId:', deviceId);
        res.status(200).json({ message: 'Garden deleted successfully' });
    });
});

app.post('/api/automation', (req, res) => {
    const {
        type, start_time, end_time, deviceId, is_check_threshold, typeMeasureDevice,
        lower_threshold_value, upper_threshold_value, is_enabled, selected_date, is_daily
    } = req.body;

    let change_var_hasThreshold = req.body['is_check_threshold'];
    let change_var_typeMeasureDevice = req.body['type_measure_device'];
    let change_var_lower_ThresholdValue = req.body['lower_threshold_value'];
    let change_var_upper_ThresholdValue = req.body['upper_threshold_value'];
    let change_var_deviceId = req.body['device_id'];
    let change_var_type = req.body['type_control_device'];
    let change_var_is_daily = req.body['is_daily'];
    let change_var_selected_date = req.body['selected_date'];
    let change_var_is_enabled = req.body['is_enabled'];

    console.log(req.body);

    const sql = 'INSERT INTO automation (type_control_device, start_time, end_time, device_id, is_check_threshold, type_measure_device, lower_threshold_value, upper_threshold_value, is_enabled, is_daily, selected_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [
        change_var_type, start_time, end_time, change_var_deviceId, change_var_hasThreshold,
        change_var_typeMeasureDevice, change_var_lower_ThresholdValue, change_var_upper_ThresholdValue,
        change_var_is_enabled, change_var_is_daily, change_var_selected_date
    ], (err, result) => {
        if (err) {
            console.error('Error inserting automation:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Fetch the inserted automation to return it
        const insertedId = result.insertId;
        const fetchSql = 'SELECT * FROM automation WHERE id = ?';

        db.query(fetchSql, [insertedId], (fetchErr, fetchResult) => {
            if (fetchErr) {
                console.error('Error fetching new automation:', fetchErr);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(201).json(fetchResult[0]);
        });
    });
});


app.get('/api/automation', (req, res) => {
    const sql = 'SELECT * FROM automation';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error querying automation:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(result);
    });
});

app.put('/api/automation/:id/toggle', (req, res) => {
    const id = req.params.id;
    const sql = 'UPDATE Automation SET is_enabled = !is_enabled WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error updating automation:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Automation status toggled successfully' });
    });
});

app.patch('/api/automation/:id', (req, res) => {
    const id = req.params.id;
    const { is_enabled } = req.body;

    const sql = 'UPDATE automation SET is_enabled = ? WHERE id = ?';
    db.query(sql, [is_enabled, id], (err, result) => {
        if (err) {
            console.error('Error updating automation:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Automation status updated successfully' });
    });
});

app.delete('/api/automation/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Automation WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting automation:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Automation deleted successfully' });
    });
});


// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});