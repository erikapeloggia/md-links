#!/usr/bin/env node

// Chamando a função extractLinks
const { extractLinks } = require('./index.js');

// Para pegar o caminho que o usuário colocar com o md-links
const path = process.argv[2]

extractLinks(path).then((links) => {
  console.log(links);
});

console.log(extractLinks(path));


