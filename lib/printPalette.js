'use strict';

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _terminalKit = require('terminal-kit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printPalette(colors, url) {
  // Won't display palette if terminal doesn't support colors
  if (!_supportsColor2.default) {
    return;
  }

  // Will display warning if terminal doesn't support 24bit colors
  var colorSupportWarning = _supportsColor2.default.has16m ? '' : 'Note: This palette is an approximation of the true colors displayed on you browser\n';

  _terminalKit.terminal.dim(colorSupportWarning);

  colors.forEach(function (color) {
    _terminalKit.terminal.bgColorRgbHex(color);
    _terminalKit.terminal.brightBlack.bold('   ' + color + '   ');
  });

  (0, _terminalKit.terminal)('\n');
  _terminalKit.terminal.bgDefaultColor();

  (0, _terminalKit.terminal)('Link to this palette: ' + url + ' \n\n');
}

module.exports = printPalette;