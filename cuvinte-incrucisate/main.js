const wndb = require('wordnet-db');
const WordNet = require("node-wordnet");
var url = require('url');
const path = require('path'),
    request = require('request');
var express = require('express');
const http = require("http");
const fs = require('fs').promises;
const fs_ = require('fs');

var wordnet = new WordNet({ dataDir: "C:\\Users\\bvolo\\proiecte-master\\cuvinte-incrucisate\\node_modules\\wordnet-db\\dict" })

console.log("wordnet database: ")
console.log(wndb);

var app = express();
app.use(express.json())
app.use(express.static('public'));

var data = { word: "start" };

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get("/search", (req, res) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    console.log("Cauta ppentru cuvantul: ", query);
    data.word = query.word;
    res.send("");

});

var longpoll = require("express-longpoll")(app)
// You can also enable debug flag for debug messages
// var longpollWithDebug = require("express-longpoll")(app, { DEBUG: true });

longpoll.create("/word");

app.listen(4005, function () {
    console.log("Listening on port 4005");
});

// Publishes data to all clients long polling /poll endpoint
// You need to call this AFTER you make a GET request to /poll
longpoll.publish("/word", data);

// Publish every 5 seconds
setInterval( function () {


     get_synonyms();
     get_hyponyms();
     get_meronyms();

    
    longpoll.publish("/word", data);
}, 6000);




 function get_synonyms(){
     wordnet.lookup(data.word, function (results) {
        console.log('Sinonime pt cuvantul: ' + data.word);
        let rezData = []
        results.forEach(function (result) {
            rezData = [...rezData, ...result.synonyms] ;
            
        });

        rezData = rezData.filter(function(item, pos) {
            return rezData.indexOf(item) == pos;
        })

        data.synonyms = rezData;
    });
}


function get_hyponyms(term){
    // wordnet.lookupAsync(data.word, function (results) {
    //     results.forEach(function (result) {
    //         console.log('Rezultate wordnet pt cuvantul: ' + data.word);
    //         // console.log(result.synsetOffset);
    //         // console.log(result.pos);
    //         // console.log(result.lemma);
    //         console.log(result.synonyms);
    //         // console.log(result.pos);
    //         // console.log(result.gloss);
    //         data.synonim = result.synonyms;
    //     });
    // });
}

async function get_meronyms(){
    
}








// console.log('------------------------------------');
// wordnet.validForms('axes#1', console.log);


// console.log('=================================');
// wordnet.querySense('sun', console.log);