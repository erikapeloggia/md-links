#!/usr/bin/env node

// Chamando a função extractLinks
const { extractLinks } = require('./index.js');

// Para pegar o caminho que o usuário colocar com o md-links
const path = process.argv[2]

// Opções para o usuário escolher o que ver do arquivo md
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
}

const chalk = require('chalk');

extractLinks(path, options).then((links) => {
  if (options.stats && options.validate) {
    console.log(chalk.green('Total: ', links.total) + ' | ' +
      chalk.blue('Unique: ', links.unique)  + ' | ' +
      chalk.red('Broken: ', links.broken),
    );
  } else if (options.validate) {
    links.forEach((link) => {
      if (link.status === 200){
        console.log(chalk.white('Title: '), chalk.blue(link.text));
        console.log(chalk.white('URL: '), chalk.green(link.url));
        console.log(chalk.white('Path: '), chalk.white(link.file));
        console.log(chalk.white('Status: '), chalk.green(link.status), chalk.green('☑ OK', '\n'));
      } else {
        console.log(chalk.black('Title: '), chalk.rgb(241, 164, 21)(link.text));
        console.log(chalk.black('URL: '), chalk.redBright(link.url));
        console.log(chalk.black('Path: '), chalk.black(link.file));
        console.log(chalk.black('Status: '), chalk.redBright(link.status, ' ☒ FAIL', '\n'));
      } 
    });
  } else if (options.stats) {
    console.log(chalk.black.green('Total: ', links.total) + ' | ' +
      chalk.blue('Unique: ', links.unique),
    );
  } else {
    links.forEach((link) => {
      console.log(chalk.black('Title: '), chalk.cyanBright(link.text))
      console.log(chalk.black('URL: '), chalk.white(link.url)),
      console.log(chalk.black('Path: '), chalk.blue(link.file, '\n'));
    });
  }
}).catch((error) => {
  if (error.message === 'Empty file.') {
    console.log('Empty file');
  } else {
    console.log('Invalid command');
  }
});