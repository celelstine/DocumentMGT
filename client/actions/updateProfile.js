import axios from 'axios';
import sendMessage from './message';

const updateProfile = (userid, updates) =>
  axios.put(`/api/v1/users/${userid}`, updates)
  .then((response) => {
    // if jwt was returned
    if (response.data.jwtToken) {
      localStorage.setItem('jwt', JSON.stringify(response.data.jwtToken));
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      // reload the page to recieve new values from local storage
      window.location = '/#/dashboard';
      return sendMessage('profile', 'Profile has been successfully updated');
    }
    return sendMessage('profile',
    'Unable to update your profile, please try again');
  })
  .catch((error) => {
    let message = 'An internal error occurred, please try again';
    if (error.response.status !== 500) {
      message = error.response.data.message;
    }
    return sendMessage('profile', message);
  });

export default updateProfile;
