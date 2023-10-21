//chamar FileSystem
const fs = require('fs');

//função para extrair os links dos arquivos .md 
function extractLinks(path, options) {
// ler o conteúdo
  return fs.promises.readFile(path, 'utf8').then ((fileContent) => {
    if (!fileContent) {
      throw new Error('Empty file.');
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
      } if (options.stats){
       return Promise.all(validations).then((validateArray)=>
        statsLinks(validateArray, options));
      }
    }
    return objLinks;
  })
};

// função para validar os links do arquivo .md
function validateLinks(link) {
  // a função fetch é chamada com a URL do link
  return fetch(link.url)
    .then(response => {
      //verifica se a propriedade 'ok' da resposta é 'true'
      if (response.ok) {
        link.valid = true;
        link.status = response.status;
      } else {
        link.valid = false;
        link.status = response.status;
      }
      return link;
    })
    //Define como false indicando que o link não é válido devido a um erro
    .catch(error => {
      link.valid = false;
      link.error = error.message;
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
module.exports = { extractLinks, validateLinks, statsLinks };
