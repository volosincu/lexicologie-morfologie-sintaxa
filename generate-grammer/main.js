

const peggy = require("peggy");
const propositionalGram = require("./propositional");


function log (s){
    console.log(s);
}


log(propositionalGram.parse("subject predicat object "))

log(propositionalGram.parse("subject predicat object preposition"))