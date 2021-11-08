

const peggy = require("peggy");
const propositionalGram = require("./propositional");


function log (s){
    console.log(s);
}

//  I saw Ana on the hill
//  subject predicat object on object
log(propositionalGram.parse("subject predicat object on object"))
log(propositionalGram.parse("subject predicat object"))
log(propositionalGram.parse("object predicat subject"))


log(propositionalGram.parse("subject predicat on object"))


// log(propositionalGram.parse("subject predicat for object"))