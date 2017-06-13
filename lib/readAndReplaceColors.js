'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _replacestream = require('replacestream');

var _replacestream2 = _interopRequireDefault(_replacestream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Valid entries: $color_main : white | $color-main : rgb(11, 11, 11); | $colormain : #ABCABC; | $color_main : |
// Invalid entries: $color : white | any other invalid SASS or SCSS variables syntax
var colorStyleRegex = /(\$color)(\S+)( ?: ?)(.*);?/g;

var newFileContent = '';

function readFileStream(globalColorsVariablesFile, colors, colorsCopy) {
  var cols = [].concat(_toConsumableArray(colors));
  _fsExtra2.default.createReadStream(globalColorsVariablesFile).pipe((0, _replacestream2.default)(colorStyleRegex, nextColor) // eslint-disable-line no-use-before-define
  ).on('error', function (err) {
    return console.log('Stream error:  + ' + err);
  }).on('data', function (chunk) {
    newFileContent += chunk;
  }).on('error', function (err) {
    return console.log('Data error:  + ' + err);
  }).on('end', function () {
    return overwriteFile(newFileContent);
  }); // eslint-disable-line no-use-before-define

  // Copies the variable name and replaces the color at the end
  function nextColor(line) {
    // When colors array is empty, reload colors again
    if (cols.length === 0) {
      cols = [].concat(_toConsumableArray(colorsCopy));
    }
    return '' + (arguments.length <= 1 ? undefined : arguments[1]) + (arguments.length <= 2 ? undefined : arguments[2]) + (arguments.length <= 3 ? undefined : arguments[3]) + cols.shift() + ';';
  }

  function overwriteFile(string) {
    _fsExtra2.default.truncate(globalColorsVariablesFile, 0, function () {
      _fsExtra2.default.writeFile(globalColorsVariablesFile, string, function (err) {
        if (err) {
          return console.log('Error writing file: + ' + err);
        }
      });
    });
  }
}

module.exports = readFileStream;