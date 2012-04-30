define([
  "../lib/latex-parser",
  "text!logs/errors.log",
  "text!logs/bad-boxes.log"
],
function(LatexParser, errorLog, badBoxesLog) {

module("Errors");

test("Error parsing", function() {
  var errors = LatexParser.parse(errorLog, {
    ignoreDuplicates : true
  }).errors;

  expectedErrors = [
    [29, "Undefined control sequence."] + "",
    [30, "LaTeX Error: \\begin{equation} on input line 28 ended by \\end{equaion}."] + "",
    [30, "Missing $ inserted."] + "",
    [30, "Display math should end with $$."] + "",
    [46, "Extra }, or forgotten \\right."] + "",
    [46, "Missing \\right. inserted."] + "",
    [46, "Missing } inserted."] + ""
  ];

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    }
  }
});

module("Bad boxes");

test("Badbox parsing", function() {
  var errors = LatexParser.parse(badBoxesLog).typesetting;

  expectedErrors = [
    [9, "Overfull \\hbox (29.11179pt too wide) in paragraph at lines 9--10"] + "",
    [11, "Underfull \\hbox (badness 10000) in paragraph at lines 11--13"] + "",
    [27, "Overfull \\vbox (12.00034pt too high) detected at line 27"] + "",
    [46, "Underfull \\vbox (badness 10000) detected at line 46"] + "",
    [54, "Underfull \\hbox (badness 10000) in paragraph at lines 54--55"] + "",
    [58, "Underfull \\hbox (badness 10000) in paragraph at lines 58--60"] + ""
  ]

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    }
  }
});

module("General");

test("Ignore Duplicates", function() {
  var errors = LatexParser.parse(errorLog).errors;
  equal(errors.length, 10, "Duplicates included");
  
  errors = LatexParser.parse(errorLog, {ignoreDuplicates : true}).errors;
  equal(errors.length, 7, "Duplicates ignored");
});

test("File paths", function() {
  var errors = LatexParser.parse(errorLog).errors;

  for (var i = 0; i < errors.length; i++) {
      equal(errors[i].file, "compiles/dff0c37d892f346e58fc14975a16bf69/sections/appendices.tex", "File path correct")
  }

  var errors = LatexParser.parse(badBoxesLog).all;
  for (var i = 0; i < errors.length; i++) {
      equal(errors[i].file, "compiles/b6cf470376785e64ad84c57e3296c912/logs/bad-boxes.tex", "File path correct")
  }
});

});
