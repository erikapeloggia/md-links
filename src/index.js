//chamar FilSystem
const fs = require('fs');

//função para extrair os links dos arquivos .md 
function extractLinks(path, options) {
// ler o conteúdo
  return fs.promises.readFile(path, 'utf8').then ((fileContent) => {
    // Regex para identificar links
    const pattern = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    // Cria um array com MatchAll para pegar todas as correspodências de links no arquivo 
    const matches = [...fileContent.matchAll(pattern)];

    // Cria um objeto para especificar as informações que vai mostrar
    const objLinks = matches.map((link) => ({ 
      text: link[1],
      url: link[2],
      file: path,
    })
    )
    return objLinks;
  }) 
};

//export da função para o CLI
module.exports = { extractLinks };
