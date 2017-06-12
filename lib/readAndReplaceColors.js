const fse = require('fs-extra');
const replaceStream = require('replacestream');

// Valid entries: $color_main : white | $color-main : rgb(11, 11, 11); | $colormain : #ABCABC; | $color_main : |
// Invalid entries: $color : white | any other invalid SASS or SCSS variables syntax
let colorStyleRegex = /(\$color)(\S+)( ?: ?)(.*);?/g;

let newFileContent = '';

function readFileStream(globalColorsVariablesFile, colors, colorsCopy) {
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
        });

    // Copies the variable name and replaces the color at the end
    function randomColor() {
        if (colors.length === 0) {
            colors = [].concat(colorsCopy);
        }
        return arguments[1] + arguments[2] + arguments[3] + colors.shift() + ';';
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
}


module.exports = readFileStream;
