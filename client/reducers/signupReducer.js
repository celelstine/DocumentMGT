import * as types from '../actions/actionTypes';  
import initialState from './initialState';
import { HashRouter } from 'react-router-dom';

export default function sessionReducer(state = initialState.session, action) {  
  switch(action.type) {
    case types.SIGNUP_IN_SUCCESS:
      window.location = '/#/dashboard';
      return !!localStorage.jwt
    default: 
      return state;
  }
}