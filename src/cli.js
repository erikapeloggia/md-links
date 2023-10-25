#!/usr/bin/env node

// Chamando a função mdLinks
const { mdLinks } = require('./index.js');

// Para pegar o caminho que o usuário colocar com o md-links
const path = process.argv[2]

// Opções para o usuário escolher o que ver do arquivo md
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
}

// Chamando o chalk para estilizar as mensagens no terminal
const chalk = require('chalk');

// manipulando a função mdLinks com estilização do chalk para mostrar os resultados de acordo com a escolha do usuário
mdLinks(path, options).then((links) => {
  // if do --validate e --stats combinados
  if (options.stats && options.validate) {
    console.log(chalk.green('Total: ', links.total) + ' | ' + chalk.blue('Unique: ', links.unique)  + ' | ' + chalk.red('Broken: ', links.broken));
  //else para a opção --validate
  } else if (options.validate) {
    links.forEach((link) => {
      // quando o links for status 200, retornará com uma estilização específica
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
  // else para opção de --stats  
  } else if (options.stats) {
    console.log(chalk.black.green('Total: ', links.total) + ' | ' + chalk.blue('Unique: ', links.unique));
  // else do retorno do array com extração dos links
  } else {
    links.forEach((link) => {
      console.log(chalk.black('Title: '), chalk.cyanBright(link.text))
      console.log(chalk.black('URL: '), chalk.white(link.url)),
      console.log(chalk.black('Path: '), chalk.blue(link.file, '\n'));
    });
  }
// catch error com as mensagens de acordo com a escolha de leitura de arquivo  
}).catch((error) => {
  if (error.message === 'Unable to read the file because it is empty') {
    console.log(chalk.red('Unable to read the file because it is empty'));
  } else if (error.message === 'Incompatible file: not a Markdown file') {
    console.log(chalk.red('Incompatible file: not a Markdown file'));
  } else if (error.message === 'No links found in this file') {
    console.log(chalk.red('No links found in this file'));
  } else {
    console.log(chalk.yellow('Invalid command'));
  }
});