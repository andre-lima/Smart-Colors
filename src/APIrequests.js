import axios from 'axios';

function makeRequests() {
  const url = 'http://www.colourlovers.com/api/palettes/random?format=json';

  return axios.get(url)
    .then(response => response)
    .catch((error) => {
      console.log(error);
    });
}

module.exports = makeRequests;
