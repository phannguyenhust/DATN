export const ADD_GARDEN = 'ADD_GARDEN';

export const addGarden = (name, plantingDate, deviceCode) => ({
  type: ADD_GARDEN,
  payload: {
    name,
    plantingDate,
    deviceCode
  },
});
