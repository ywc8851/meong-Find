import axios from 'axios';

export const getSignInTemplate = async () => {
  return await axios.get('/signin');
};
