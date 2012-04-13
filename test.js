var requirejs = require("requirejs");
var fs = require('fs');

requirejs(["latex-parser"], function(LatexParser) {
    var log = fs.readFileSync("tests/test2.txt").toString();
    var data = LatexParser.parse(log);
    for (i in data) {
        console.log("ERROR: ", data[i].message, data[i].line);
    }
})
