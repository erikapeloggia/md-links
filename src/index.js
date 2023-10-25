//chamar FileSystem
const fs = require('fs');
const pathway = require('path');

//função para extrair os links dos arquivos .md 
function mdLinks(path, options) {
  const absolutePath = pathway.resolve(path);
// ler o conteúdo
  return fs.promises.readFile(path, 'utf8').then ((fileContent) => {
    if (pathway.extname(absolutePath).toLowerCase() !== '.md') {
      throw new Error('Incompatible file: not a Markdown file');
    } else if (!fileContent) {
      throw new Error('Unable to read the file because it is empty');
    }
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
    if (objLinks.length === 0) {
      throw new Error('No links found in this file');
    }
    // Cria uma condição para saber a escolha do usuário
    if (options.validate || options.stats){
      // cria um novo array a partir da validação dos links
      const validations = objLinks.map((link) =>
          validateLinks(link)
        )
      //"exclue" a função de stats para validar os links  
      if (options.validate && !options.stats){
        return Promise.all(validations);
      // roda a função de estatísticas dos links  
      } else {
       return Promise.all(validations).then((validateArray)=>
        statsLinks(validateArray, options));
      }
    }
    return objLinks;
  }).catch((error) => {
    if (error.code === 'ENOENT') {
      throw new Error('Invalid Command');
    } 
    throw error;
  });
};

// Função para validar os links do arquivo .md
function validateLinks(link) {
  // A função fetch é chamada com a URL do link
  return fetch(link.url)
    .then((response) => {
      if (response.ok) {
        // Se a resposta for bem-sucedida (status 200), o link é válido
        link.valid = true;
        link.status = response.status;
      } else {
        // Se a resposta não for bem-sucedida (status diferente de 200),
        // o link é considerado inválido, e uma exceção é lançada
        link.valid = false;
        link.status = response.status;
        throw new Error('HTTP status ' + response.status);
      }
      return link;
    })
    .catch((error) => {
      // Se ocorrer algum erro durante a requisição (como erro de rede),
      // o link é considerado inválido, e o erro é capturado e armazenado
      // no campo 'error' do objeto link
      link.valid = false;
      link.error = error.message; // Captura a mensagem de erro
      return link;
    });
}

// função de estatísticas dos links
function statsLinks(links) {
  // passa por cada links enumerando o total
  const totalLinks = links.length;
  // filtra somente o numero de links unicos
  const uniqueLinks = [...new Set(links.map((link) => link.url))].length;
  // filtra somente o numero de links quebrados
  const brokenLinks = links.filter((link) => link.status !== 200).length;
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

//export das funções para o CLI
module.exports = { mdLinks, validateLinks, statsLinks };