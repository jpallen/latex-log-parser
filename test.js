var requirejs = require("requirejs");
var fs = require('fs');

requirejs(["latex-parser"], function(LatexParser) {
    var log = fs.readFileSync("tests/test3.log").toString();
    var data = LatexParser.parse(log);
    for (i in data) {
        console.log(data[i].level, ": ", data[i].message, "(line ", data[i].line, ")", data[i].file);
    }
})
