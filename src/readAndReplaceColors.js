import fse from 'fs-extra';
import replaceStream from 'replacestream';

// Valid entries: $color_main : white | $color-main : rgb(11, 11, 11); | $colormain : #ABCABC; | $color_main : |
// Invalid entries: $color : white | any other invalid SASS or SCSS variables syntax
// const colorStyleRegex = /(\$color)(\S+)( ?: ?)(.*)(;?)/g;
const colorStyleRegex = /(\$color)(\S+)( ?: ?)(#\w*)(;?)(( *\/\/)( *)(disable smart-colors))?/g;
let newFileContent = '';

function readFileStream(globalColorsVariablesFile, colors) {
  let colorsCopy = [...colors];
  fse.createReadStream(globalColorsVariablesFile)
    .pipe(replaceStream(colorStyleRegex, nextColor)) // eslint-disable-line no-use-before-define
    .on('error', err => console.log(`Stream error:  + ${err}`))
    .on('data', (chunk) => { newFileContent += chunk; })
    .on('error', err => console.log(`Data error:  + ${err}`))
    .on('end', () => overwriteFile(newFileContent)); // eslint-disable-line no-use-before-define

  // Copies the variable name and replaces the color at the end
  function nextColor(line, ...args) {
    // If added the disable comment, skip this variable
    if (args[8]) {
      return line;
    }

    // When colors array is empty, reload colors again
    if (colorsCopy.length === 0) {
      colorsCopy = [...colors];
    }

    return `${args[0]}${args[1]}${args[2]}${colorsCopy.shift()}${args[4]}`;
  }

  function overwriteFile(string) {
    fse.truncate(globalColorsVariablesFile, 0, () => {
      fse.writeFile(globalColorsVariablesFile, string, (err) => {
        if (err) {
          return console.log(`Error writing file: + ${err}`);
        }
      });
    });
  }
}

module.exports = readFileStream;
