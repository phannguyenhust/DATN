function handleDeviceControl(deviceType, action) {
    switch (deviceType) {
      case 'Đèn':
        if (!lightManualOverride && lightStatus !== action) {
          publishWithRetain('esp/light', action);
          console.log(`Turned ${action === 'ON' ? 'on' : 'off'} light`);
          lightStatus = action;
        }
        break;
      case 'Bơm':
        if (!pumpManualOverride && pumpStatus !== action) {
          publishWithRetain('esp/pump', action);
          console.log(`Turned ${action === 'ON' ? 'on' : 'off'} pump`);
          pumpStatus = action;
        }
        break;
      case 'Quạt':
        if (!fanManualOverride && fanStatus !== action) {
          publishWithRetain('esp/fan', action);
          console.log(`Turned ${action === 'ON' ? 'on' : 'off'} fan`);
          fanStatus = action;
        }
        break;
      default:
        console.log('Unknown device type');
    }
  }

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
            


            if(automation.is_daily){
                if(currentTime >= automation.start_time && currentTime <= automation.end_time){
                    if (!automation.is_check_threshold) {
                        // console.log('Automation is daily and not check threshold');
                        handleDeviceControl(automation.type_control_device, 'ON');
                    }
                    // else {
                    //     // console.log('Automation is daily and check threshold');
                    //     if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
                    //         if (!pumpManualOverride && soilHumidity <= automation.lower_threshold_value && automation.type_measure_device === 'soil_humidity' && automation.lower_threshold_value !== '') {
                    //             mqttClient.publish('esp/pump', 'ON')
                    //             console.log('Turned on pump')
                    //         } else if (!pumpManualOverride && automation.upper_threshold_value >= soilHumidity && automation.type_measure_device === 'soil_humidity' && automation.upper_threshold_value !== '') {
                    //             mqttClient.publish('esp/pump', 'OFF')
                    //             console.log('Turned off pump')
                    //         } else if (!fanManualOverride && temperature >= automation.upper_threshold_value && automation.type_measure_device === 'temperature' && automation.upper_threshold_value !== '') {
                    //             mqttClient.publish('esp/fan', 'ON')
                    //             console.log('Turned on fan')
                    //         } else if (!lightManualOverride && temperature <= automation.lower_threshold_value && automation.type_measure_device === 'temperature' && automation.lower_threshold_value !== '') {
                    //             mqttClient.publish('esp/light', 'ON')
                    //             console.log('Turned on light')
                    //         }
                    //     }

                    // }
                }
                else {
                    handleDeviceControl(automation.type_control_device, 'OFF');
                }
            }
            // else {
            //     if(currentDate == automation.selected_date){
            //         if(currentTime >= automation.start_time && currentTime <= automation.end_time){
            //             if (!automation.is_check_threshold) {
            //                 // console.log('Automation is daily and not check threshold');
            //                 switch (automation.type_control_device) {
            //                     case 'Đèn':
            //                         if(!lightManualOverride && lightStatus === 'OFF'){
            //                           publishWithRetain('esp/light', 'ON');
            //                           console.log('Turned on light');
            //                           lightStatus = 'ON' ;
            //                         }
            //                         break;
            //                     case 'Bơm':
            //                         if(!pumpManualOverride && pumpStatus === 'OFF'){
            //                           publishWithRetain('esp/pump', 'ON');
            //                           console.log('Turned on pump');
            //                           pumpStatus = 'ON' ;
            //                         }
            //                         break;
            //                     case 'Quạt':
            //                          if (!fanManualOverride && fanStatus === 'OFF') {
            //                               publishWithRetain('esp/fan', 'ON');
            //                               console.log('Turned on fan');
            //                               fanStatus = 'ON';
            //                           }
            //                           break;
            //                     default:
            //                         console.log('Unknown device type');
            //                 }
            //             }
            //             else {
            //                 // console.log('Automation is daily and check threshold');
            //                 if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
            //                     if (!pumpManualOverride && soilHumidity <= automation.lower_threshold_value && automation.type_measure_device === 'soil_humidity' && automation.lower_threshold_value !== '') {
            //                         mqttClient.publish('esp/pump', 'ON')
            //                         console.log('Turned on pump')
            //                     } else if (!pumpManualOverride && automation.upper_threshold_value >= soilHumidity && automation.type_measure_device === 'soil_humidity' && automation.upper_threshold_value !== '') {
            //                         mqttClient.publish('esp/pump', 'OFF')
            //                         console.log('Turned off pump')
            //                     } else if (!fanManualOverride && temperature >= automation.upper_threshold_value && automation.type_measure_device === 'temperature' && automation.upper_threshold_value !== '') {
            //                         mqttClient.publish('esp/fan', 'ON')
            //                         console.log('Turned on fan')
            //                     } else if (!lightManualOverride && temperature <= automation.lower_threshold_value && automation.type_measure_device === 'temperature' && automation.lower_threshold_value !== '') {
            //                         mqttClient.publish('esp/light', 'ON')
            //                         console.log('Turned on light')
            //                     }
            //                 }
    
            //             }
            //         }
            //         else {
            //             switch (automation.type_control_device) {
            //                 case 'Đèn':
            //                     if(!lightManualOverride && lightStatus === 'ON'){
            //                       publishWithRetain('esp/light', 'OFF');
            //                       console.log('Turned on light');
            //                       lightStatus = 'OFF' ;
            //                     }
            //                     break;
            //                 case 'Bơm':
            //                     if(!pumpManualOverride && pumpStatus === 'ON'){
            //                       publishWithRetain('esp/pump', 'OFF');
            //                       console.log('Turned on pump');
            //                       pumpStatus = 'OFF' ;
            //                     }
            //                     break;
            //                 case 'Quạt':
            //                      if (!fanManualOverride && fanStatus === 'ON') {
            //                           publishWithRetain('esp/fan', 'OFF');
            //                           console.log('Turned on fan');
            //                           fanStatus = 'OFF';
            //                       }
            //                       break;
            //                 default:
            //                     console.log('Unknown device type');
            //             }
            //         }
            //     }
            // }

           







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
                                if(!pumpManualOverride && pumpStatus === 'OFF'){
                                  publishWithRetain('esp/pump', 'ON');
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
                        switch (automation.type_control_device) {
                            case 'Đèn':
                                if(!lightManualOverride && lightStatus === 'ON'){
                                  publishWithRetain('esp/light', 'OFF');
                                  console.log('Turned off light');
                                  lightStatus = 'OFF';
                                }
                                break;
                            case 'Bơm':
                                if(!pumpManualOverride && pumpStatus === 'ON'){
                                  publishWithRetain('esp/pump', 'OFF');
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

                    if (currentTime >= automation.start_time && currentTime <= automation.end_time) {
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