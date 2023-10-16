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
    // chama a função de validação de links dentro da extração
    if (options.validate){
      const validations = objLinks.map((link) =>
        validateLink(link)
      );
      return Promise.all(validations);
    } 
    return objLinks;
  }) 
};

// função para validar os links do arquivo .md
function validateLink(link) {
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

//export das funções para o CLI
module.exports = { extractLinks, validateLink };
