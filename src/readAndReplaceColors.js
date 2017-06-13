import fse from 'fs-extra';
import replaceStream from 'replacestream';

// Valid entries: $color_main : white | $color-main : rgb(11, 11, 11); | $colormain : #ABCABC; | $color_main : |
// Invalid entries: $color : white | any other invalid SASS or SCSS variables syntax
let colorStyleRegex = /(\$color)(\S+)( ?: ?)(.*);?/g;

let newFileContent = '';

function readFileStream(globalColorsVariablesFile, colors, colorsCopy) {
  let cols = [...colors];
  fse.createReadStream(globalColorsVariablesFile)
    .pipe(replaceStream(colorStyleRegex, nextColor)) // eslint-disable-line no-use-before-define
    .on('error', err => console.log(`Stream error:  + ${err}`))
    .on('data', (chunk) => { newFileContent += chunk; })
    .on('error', err => console.log(`Data error:  + ${err}`))
    .on('end', () => overwriteFile(newFileContent)); // eslint-disable-line no-use-before-define

  // Copies the variable name and replaces the color at the end
  function nextColor(line, ...args) {
    // When colors array is empty, reload colors again
    if (cols.length === 0) {
      cols = [...colorsCopy];
    }
    return `${args[0]}${args[1]}${args[2]}${cols.shift()};`;
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
