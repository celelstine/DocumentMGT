import * as types from '../actions/actionTypes';

export default function sessionReducer(state = '', action) {
  switch(action.type) {
    case types.LOG_FAILED:
      return action.loginMessage
    default:
      return state;
  }
}