import chalk from 'chalk';

function printPalette(colors, url) {
  // Won't display palette if terminal doesn't support colors
  if (chalk.level === 0) {
    return;
  }
  
  console.log(chalk`{underline                                                                                                           }`);
  console.log(chalk`{blueBright                                                                                            >> SMART COLORS}`);

  let colorNames = '';
  let palette = '';
  colors.forEach((color) => {
    colorNames += `      ${color}      `;
    palette += chalk`{bgHex(${color})                    }`;
  });
  palette += chalk`{reset }`;  //Resets colors to default values

  console.log(colorNames);
  console.log(palette);
  console.log(`Link to this palette: ${url}`);
  
  // Will display warning if terminal doesn't support 24bit colors
  if(chalk.level <= 2)
    console.log(chalk.dim('\nNote: This palette is an approximation of the true colors displayed on you browser'));

  console.log(chalk`{underline                                                                                                           }`);
}

module.exports = printPalette;
