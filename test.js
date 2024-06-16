if (automation.is_daily) {
    handleTime();
}
else{
    console.log("chan truoc truong hop selected_date");
    if(currentDate == automation.selected_date){
        handleTime();
    }
}

function handleTime(){
    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
        if (!automation.is_check_threshold) {
            handleNoCheckThreshold();
        }
        else {
            handleCheckThreshold();
        }
    }
    else {
        handleOutTime();
    }
}
function handleOutTime(){
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
                    publishWithRetain('esp/pump', 'off', true);
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
function handleCheckThreshold(){
    console.log("chan truoc co check nguong");
        if (!pumpManualOverride && soilHumidity <= automation.lower_threshold_value && automation.type_measure_device === 'soil_humidity' && automation.lower_threshold_value !== '') {
            mqttClient.publish('esp/pump', 'ON')
            console.log('Turned on pump')
        } else if (!pumpManualOverride && automation.upper_threshold_value >= soilHumidity && automation.type_measure_device === 'soil_humidity' && automation.upper_threshold_value !== '') {
            mqttClient.publish('esp/pump', 'OFF')
            console.log('Turned off pump')
        } else if (!fanManualOverride && temperature >= automation.upper_threshold_value && automation.type_measure_device === 'temperature' && automation.upper_threshold_value !== '') {
            mqttClient.publish('esp/fan', 'ON')
            console.log('Turned on fan')
        } else if (!lightManualOverride && temperature <= automation.lower_threshold_value && automation.type_measure_device === 'temperature' && automation.lower_threshold_value !== '') {
            mqttClient.publish('esp/light', 'ON')
            console.log('Turned on light')
        }
}
function handleNoCheckThreshold(){
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
            console.log(!pumpManualOverride);
            if(!pumpManualOverride && pumpStatus === 'OFF'){
            publishWithRetain('esp/pump', 'on', true);
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