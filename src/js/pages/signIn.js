import axios from 'axios';

export const fetch = async () => {
  const { data } = await axios.get('/signin');
  document.querySelector('#app').innerHTML = data;
  console.log('location: ' + document.location + ', state: ' + JSON.stringify(event.state));
};

window.addEventListener('popstate', fetch);
