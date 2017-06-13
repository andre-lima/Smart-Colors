const path = require('path');
const fse = require('fs-extra');
const printPalette = require('./lib/printPalette');
const APIrequest = require('./lib/APIrequests');
const readFileStream = require('./lib/readAndReplaceColors');

// HOW TO LOOP WAITING FOR INPUT
// http://jttan.com/2016/06/node-js-basic-command-line-interactive-loop/


// Source variable file and backup file
const globalColorsVariablesFile = path.join(__dirname, './demo/colors.scss');
const backupVariablesFile = path.join(__dirname, './demo/colors.BKP.scss');

const copyOptions = {
  overwrite: false,
  errorOnExist: false
};

// Makes a copy of the origin file with there's none already
fse.copy(globalColorsVariablesFile, backupVariablesFile, copyOptions, (err) => {
  if (err) {
    return console.error(err);
  }
});

// Colors will come from an API call to COLOURLOVERS
let colors = [];
const url = 'http://www.colourlovers.com/api/palettes/random?format=json';

APIrequest(url)
  .then((resp) => {
    const paletteUrl = resp.data[0].url;
    colors = resp.data[0].colors;
    colors = colors.map((color) => {
      return color[0] !== '#' ? `#${color}` : color;
    });
    printPalette(colors, paletteUrl);
    //shuffleColors();
    readFileStream(globalColorsVariablesFile, colors);
  })
  .catch(err => console.error(err));

function shuffleColors() {
  for (let i = colors.length; i; --i) {
    const j = Math.floor(Math.random() * i);
    [colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
  }
}
