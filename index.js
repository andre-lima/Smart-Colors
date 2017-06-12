const replaceStream = require('replacestream');
const path = require('path');
const fse = require('fs-extra');
const supportsColor = require('supports-color');
var term = require('terminal-kit').terminal;

// HOW TO LOOP WAITING FOR INPUT
// http://jttan.com/2016/06/node-js-basic-command-line-interactive-loop/

// Valid entries: $color_main : white | $color-main : rgb(11, 11, 11); | $colormain : #ABCABC; | $color_main : |
// Invalid entries: $color : white | any other invalid SASS or SCSS variables syntax
let colorStyleRegex = /(\$color)(\S+)( ?: ?)(.*);?/g;

// Source variable file and backup file
const globalColorsVariablesFile = path.join(__dirname, './colors.scss');
const backupVariablesFile = path.join(__dirname, './colors.BKP.scss');

let newFileContent = '';

// Will come from an API call to COLOURLOVERS
let colors = ['#ffffff', '#000000', '#333333', '#f1e57a', '#f00000', '#123456'];
printPalette(colors);

let copyOptions = {
  overwrite: false,
  errorOnExist: false
};

// Makes a copy of the origin file with there's none already
fse.copy(globalColorsVariablesFile, backupVariablesFile, copyOptions, function (err) {
  if (err) {
    return console.error(err)
  }
  readFileStream();
});

function readFileStream() {
  fse.createReadStream(globalColorsVariablesFile)
    .pipe(replaceStream(colorStyleRegex, randomColor))
    .on('error', function (err) {
      console.log('Stream error: ' + err);
    })
    .on('data', function (chunk) {
      newFileContent += chunk;
    })
    .on('error', function (err) {
      console.log('Data error: ' + err)
    })
    .on('end', function () {
      overwriteFile(newFileContent);
    })
}

// Copies the variable name and replaces the color at the end
function randomColor() {
  return arguments[1] + arguments[2] + arguments[3] + colors.shift();
}

function overwriteFile(string) {
  fse.truncate(globalColorsVariablesFile, 0, function () {
    fse.writeFile(globalColorsVariablesFile, string, function (err) {
      if (err) {
        return console.log("Error writing file: " + err);
      }
    });
  });
}

function printPalette(colors) {
  // Won't display palette if terminal doesn't support colors
  if(!supportsColor)
    return;

  // Will display warning if terminal doesn't support 24bit colors
  let colorSupportWarning = supportsColor.has16m ? '' : 'Note: This color palette is an approximation of the colors that\'ll be displayed on you browser\n';

  term.dim(colorSupportWarning);

  colors.forEach(function (color) {
    
    term.bgColorRgbHex(color);
    term.brightBlack.bold(`   ${color}   `);
  })

  term('\n')
  term.bgDefaultColor();
}