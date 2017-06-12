const path = require('path');
const fse = require('fs-extra');
const printPalette = require('./lib/printPalette');
const APIrequest = require('./lib/APIrequests');
const readFileStream = require('./lib/readAndReplaceColors');

// HOW TO LOOP WAITING FOR INPUT
// http://jttan.com/2016/06/node-js-basic-command-line-interactive-loop/


// Source variable file and backup file
const globalColorsVariablesFile = path.join(__dirname, './colors.scss');
const backupVariablesFile = path.join(__dirname, './colors.BKP.scss');

let copyOptions = {
    overwrite: false,
    errorOnExist: false
};

// Makes a copy of the origin file with there's none already
fse.copy(globalColorsVariablesFile, backupVariablesFile, copyOptions, function (err) {
    if (err) {
        return console.error(err)
    }
});

// Colors will come from an API call to COLOURLOVERS
let colors = [];
let colorsCopy = [];
const url = 'http://www.colourlovers.com/api/palettes/random?format=json';

APIrequest(url)
    .then((resp) => {
        let paletteUrl = resp.data[0].url;
        colors = resp.data[0].colors;
        colors = colors.map(function (color) {
            if (color[0] !== '#') {
                color = '#' + color;
            }
            return color;
        });
        colorsCopy = [].concat(colors);
        printPalette(colors, paletteUrl);
        readFileStream(globalColorsVariablesFile, colors, colorsCopy);
    })
    .catch((err) => {
        return console.error(err)
    });

function shuffleColors(colors) {

}
