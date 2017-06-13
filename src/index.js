const path = require('path');
const fse = require('fs-extra');
const printPalette = require('./lib/printPalette');
const APIrequest = require('./lib/APIrequests');
const readFileAndReplace = require('./lib/readAndReplaceColors');

// HOW TO LOOP WAITING FOR INPUT
// http://jttan.com/2016/06/node-js-basic-command-line-interactive-loop/

const startModule = (function startModule() {
  // Source variable file and backup file
  const globalColorsVariablesFile = path.join(__dirname, './demo/colors.scss');
  const backupVariablesFile = path.join(__dirname, './demo/colors_BKP.scss');

  function createBackup() {
    _manageBackup(globalColorsVariablesFile, backupVariablesFile);
  }

  function restoreBackup() {
    _manageBackup(backupVariablesFile, globalColorsVariablesFile);
  }

  function _manageBackup(sourceFile, destFile) {
    const copyOptions = {
      overwrite: true,
      errorOnExist: false
    };

    // Makes a copy of the origin file with there's none already
    fse.copy(sourceFile, destFile, copyOptions, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  }

  function getNewColors() {
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
        readFileAndReplace(globalColorsVariablesFile, colors);
      })
      .catch(err => console.error(err));
  }

  function shuffleColors() {
    let colors = [];
    let fileContent = '';
    const hexColorRegex = /#([\w\d]{6})/g;

    // Gets current colors from file and shuffles them
    fse.createReadStream(globalColorsVariablesFile)
      .on('data', (chunk) => { fileContent += chunk; })
      .on('end', () => {
        colors = fileContent.match(hexColorRegex);

        for (let i = colors.length; i; --i) {
          const j = Math.floor(Math.random() * i);
          [colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
        }

        readFileAndReplace(globalColorsVariablesFile, colors);
      });
  }

  return {
    newColors: getNewColors,
    shufflePalette: shuffleColors,
    backup: createBackup,
    restore: restoreBackup
  };
}());

module.exports = startModule;
