import axios from 'axios';
import * as types from './actionTypes';
import sendMessage from './message';

const getUserAction = (status, users = []) => (
  {
    type: types.GET_USERS,
    status,
    users: users.rows || [],
    pageCount: users.count || 0,
  }
);


const getUsers = (category = '', fname = '', offset = 0, limit = 6) => 
  axios.get(
    `/api/v1/Users?status=${category}&fname=${fname}&offset=${offset}&limit=${limit}`
  )
  .then(response => {
    console.log('response.data.users', response.data);
    return getUserAction('success', response.data.users);
  }
  )
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('getUsers', message);
  });

export default getUsers;

