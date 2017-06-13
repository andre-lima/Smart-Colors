'use strict';

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeRequests() {
  var url = 'http://www.colourlovers.com/api/palettes/random?format=json';

  return _axios2.default.get(url).then(function (response) {
    return response;
  }).catch(function (error) {
    console.log(error);
  });
}

module.exports = makeRequests;