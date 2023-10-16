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

extractLinks(path, options).then((links) => {
  console.log(links);
});

