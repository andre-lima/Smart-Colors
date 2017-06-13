import supportsColor from 'supports-color';
import { terminal as term } from 'terminal-kit';

function printPalette(colors, url) {
  // Won't display palette if terminal doesn't support colors
  if (!supportsColor) {
    return;
  }

  // Will display warning if terminal doesn't support 24bit colors
  const colorSupportWarning = supportsColor.has16m ? '' : 'Note: This palette is an approximation of the true colors displayed on you browser\n';

  term.dim(colorSupportWarning);

  colors.forEach((color) => {
    term.bgColorRgbHex(color);
    term.brightBlack.bold(`   ${color}   `);
  });

  term('\n');
  term.bgDefaultColor();

  term(`Link to this palette: ${url} \n\n`);
}

module.exports = printPalette;
