// src/redux/reducers/gardenReducer.js
import { ADD_GARDEN } from '../actions/gardenActions';

const initialState = {
  gardens: [],
};

const gardenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GARDEN:
      return {
        ...state,
        gardens: [...state.gardens, action.payload],
      };
    default:
      return state;
  }
};

export default gardenReducer;
