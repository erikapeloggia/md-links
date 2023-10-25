const {mdLinks, validateLinks, statsLinks } = require('../src/index.js');
describe('function mdLinks', () => {
  it('should extract links from Markdown (.md) file', () => {
    const filePath = './src/files/links.md';
    const options = {};
    return mdLinks(filePath, options).then((result) => {
      expect(result).toEqual([
        {
          text: 'FileSystem',
          url: 'https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_file_system',
          file: filePath,
        },
        {
          text: 'REGEX',
          url: 'https://blog.dp6.com.br/regex-o-guia-essencial-das-express%C3%B5es-regulares-2fc1df38a481',
          file: filePath,
        },
        {
          text: 'REGEX',
          url: 'https://blog.dp6.com.br/regex-o-guia-essencial-das-express%C3%B5es-regulares-2fc1df38a481',
          file: filePath,
        },
        {
          text: 'Git Hub 404',
          url: 'https://github.com/PalomitaLinda',
          file: filePath,
        },
        {
          text: 'Divine Oracle',
          url: 'https://erikapeloggia.github.io/divine-oracle/divineoracle',
          file: filePath,
        }
      ]);
    });
  });

  it('sholud return a error if the file/directory doesnt exist', () => {
    const fakeFile = 'arquivoinexistente.md';
    return expect(mdLinks(fakeFile)).rejects.toThrow('file/directory not found');
  });

  it('should return a error if the file its diferent from a .md', () => {
    const fakeMdFile = './src/files/test.txt';
    return expect(mdLinks(fakeMdFile)).rejects.toThrow('Incompatible file: not a Markdown file');
  });

  it('should return a error if the file is empty', () => {
    const emptyFile = './src/files/empty.md';
    return expect(mdLinks(emptyFile)).rejects.toThrow('Unable to read the file because it is empty');
  });

  it('should return a message of no links', () => {
    const filePath = './src/files/noLinks.md';
    return expect(mdLinks(filePath)).rejects.toThrow('No links found in this file');
  });

  it('should return all link validations if the validation option is enabled', () => {
    const filePath = './src/files/links.md';
    const options = { validate: true, stats: false };
    return mdLinks(filePath, options).then((result) => {
      expect(result).toStrictEqual([
         {
           "file": "./src/files/links.md",
           "status": 200,
           "text": "FileSystem",
           "url": "https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_file_system",
           "valid": true,
         },
         {
           "file": "./src/files/links.md",
           "status": 200,
           "text": "REGEX",
           "url": "https://blog.dp6.com.br/regex-o-guia-essencial-das-express%C3%B5es-regulares-2fc1df38a481",
           "valid": true,
         },
         {
           "file": "./src/files/links.md",
           "status": 200,
           "text": "REGEX",
           "url": "https://blog.dp6.com.br/regex-o-guia-essencial-das-express%C3%B5es-regulares-2fc1df38a481",
           "valid": true,
         },
         {
          "error": "HTTP status 404",
           "file": "./src/files/links.md",
           "status": 404,
           "text": "Git Hub 404",
           "url": "https://github.com/PalomitaLinda",
           "valid": false,
         },
         {
          "error": "HTTP status 404",
           "file": "./src/files/links.md",
           "status": 404,
           "text": "Divine Oracle",
           "url": "https://erikapeloggia.github.io/divine-oracle/divineoracle",
           "valid": false,
          },
])
    });
  });

  it('should return links validations and statistics if the options is enabled', () => {
    const filePath = './src/files/links.md';
    const options = { validate: true, stats: true };
    return mdLinks(filePath, options).then((result) => {
      expect(result).toStrictEqual({"total": 5, "unique": 4, "broken": 2})
    });
  });

  it('should return links statistics if the statistics option is enabled', () => {
    const filePath = './src/files/links.md';
    const options = { validate: false, stats: true };
    return mdLinks(filePath, options).then((result) => {
      expect(result).toStrictEqual({"total": 5, "unique": 4, "broken": 2})
    });
});
});


describe('validateLinks', () => {
  it('is a function', () => {
    expect(typeof validateLinks).toBe('function');
  });
  it('should validate the link correctly', () => {
    const link = {
      text: 'test 1',
      url: 'https://becode.com.br/wp-content/uploads/2018/07/teste-logica-1152x605.png',
      file: './files/test.md',
    };
    const expectedValidLink = {
      text: 'test 1',
      url: 'https://becode.com.br/wp-content/uploads/2018/07/teste-logica-1152x605.png',
      file: './files/test.md',
      valid: true,
      status: 200,
    };
    const mockedFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
      })
    );
    global.fetch = mockedFetch;
    return validateLinks(link).then((result) => {
      expect(result).toEqual(expectedValidLink);
    });
  });
  it('should handle error for an invalid link', () => {
    const link = {
      text: 'test 2',
      url: 'https://invalidurl.example.com',
      file: './files/test.md',
    };
    const expectedInvalidLink = {
      text: 'test 2',
      url: 'https://invalidurl.example.com',
      file: './files/test.md',
      valid: false,
      error: '404',
    };
    const mockedFetch = jest.fn(() =>
      Promise.reject(new Error('404'))
    );
    global.fetch = mockedFetch;
    return validateLinks(link).then((result) => {
      expect(result).toEqual(expectedInvalidLink);
    });
  });
});


describe('statsLinks', () => {
  it('is a function', () => {
    expect(typeof statsLinks).toBe('function');
  });
  it('should calculate the statistics correctly', () => {
    const links = [
      {
        text: 'Markdown',
        url: 'https://pt.wikipedia.org/wiki/Markdown',
        file: './files/test.md',
        status: 200,
      },
      {
        text: 'Node.js',
        url: 'https://nodejs.org/',
        file: './files/test.md',
        status: 200,
      },
      {
        text: 'Laboratoria',
        url: 'https://www.laboratoria.la/ana',
        file: './files/test.md',
        status: 400,
      },
      {
        text: 'Node.js',
        url: 'https://nodejs.org/',
        file: './files/test.md',
        status: 200,
      },
    ];
    const expectedResult = {
      total: 4,
      unique: 3,
      broken: 1,
    };
    const result = statsLinks(links);
    expect(result).toEqual(expectedResult);
  });
});