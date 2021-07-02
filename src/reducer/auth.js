import {IS_AUTHENTICATED, SET_USER} from '../action/action.types';

const initialState = {
  user: null,
  loading: true,
  iaAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case IS_AUTHENTICATED:
      return {
        ...state,
        iaAuthenticated: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
