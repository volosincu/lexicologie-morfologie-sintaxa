const fs = require('fs')
const utils = require("./utilis")
const { NODE_TYPES, MAIN_TYPE, Token, NodeToken } = require("./types")

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

try {
  const data = fs.readFileSync('./Aniversarea_Teatrului_Național_Iași.txt', 'utf8')
  console.log(" >>>  Citire fisier ./Aniversarea_Teatrului_Național_Iași.txt")
  // @TODO de citit data in bucati 
  const words = data.split(" ");
  const tokens = mapTokens(words);

  fs.writeFile('./results.json', JSON.stringify(tokens), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log(" >>>  Scriere rezultate in ./results.json")
  })

} catch (err) {
  console.error(err)
}


function mapTokens(text) {
  const tokens = text.map((v) => {
    const node = new NodeToken();
    const tok = new Token();
    tok.value = v;
    tok.mainType = getTokenType(v);

    if (utils.isWordType(tok.mainType) && utils.isNoun(v)) {
      node.nodeTypes.push(NODE_TYPES.NOUN);
    }
    tok.node = node;
    return tok;
  });

  return tokens;
}

function getTokenType(word) {
  const special = utils.isIP(word) || utils.isEmail(word) || utils.isUrl(word);
  const sign = utils.isSign(word);

  if (special) {
    return getSpecialType(word);
  }

  if (sign) {
    return MAIN_TYPE.SIGN;
  }

  return MAIN_TYPE.WORD;
}

function getSpecialType(word) {
  if (utils.isEmail(word)) {
    return MAIN_TYPE.EMAIL;
  }

  if (utils.isIP(word)) {
    return MAIN_TYPE.IP;
  }

  if (utils.isUrl(word)) {
    return MAIN_TYPE.URL;
  }
}
