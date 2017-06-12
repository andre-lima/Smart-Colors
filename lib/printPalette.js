const supportsColor = require('supports-color');
const term = require('terminal-kit').terminal;

function printPalette(colors, url) {
    // Won't display palette if terminal doesn't support colors
    if (!supportsColor)
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

    term(`Link to this palette: ${url} \n\n`);

    function printLine() {
        
    }
}

module.exports = printPalette;
