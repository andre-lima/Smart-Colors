const axios = require('axios');

function makeRequests() {
  const url = 'http://www.colourlovers.com/api/palettes/random?format=json';

  return axios.get(url)
    .then(function (response) {
      return response
    }).catch(function (error) {
      console.log(error);
      return;
    });

}

module.exports = makeRequests;