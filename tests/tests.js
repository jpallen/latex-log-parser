define([
  "../lib/latex-log-parser",
  "text!logs/errors.log",
  "text!logs/warnings.log",
  "text!logs/bad-boxes.log",
  "text!logs/biber-warnings.log",
  "text!logs/natbib-warnings.log"
],
function(LatexParser, errorLog, warningLog, badBoxesLog, biberWarningsLog, natbibWarningsLog) {

function prettyFileList(files, depth) {
    depth = depth || "  ";
    for (var i = 0; i < files.length; i++) {
      console.log(depth + files[i].path);
      prettyFileList(files[i].files, depth + "  ");
    }
}

module("Errors");

test("Error parsing", function() {
  var errors = LatexParser.parse(errorLog, {
    ignoreDuplicates : true
  }).errors;

  var expectedErrors = [
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

  var expectedErrors = [
    [9, "Overfull \\hbox (29.11179pt too wide) in paragraph at lines 9--10"] + "",
    [11, "Underfull \\hbox (badness 10000) in paragraph at lines 11--13"] + "",
    [27, "Overfull \\vbox (12.00034pt too high) detected at line 27"] + "",
    [46, "Underfull \\vbox (badness 10000) detected at line 46"] + "",
    [54, "Underfull \\hbox (badness 10000) in paragraph at lines 54--55"] + "",
    [58, "Underfull \\hbox (badness 10000) in paragraph at lines 58--60"] + ""
  ];

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    }
  }
});

module("Warnings");

test("Warning parsing", function() {
  var errors = LatexParser.parse(warningLog).warnings;

  var expectedErrors = [
    [7, "Citation `Lambert:2010iw' on page 1 undefined on input line 7.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/introduction.tex"] + "",
    [7, "Citation `Lambert:2010iw' on page 1 undefined on input line 7.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/introduction.tex"] + "",
    [72, "Citation `Manton:2004tk' on page 3 undefined on input line 72.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/instantons.tex"] + "",
    [108, "Citation `Atiyah1978' on page 4 undefined on input line 108.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/instantons.tex"] + "",
    [176, "Citation `Dorey:1996hu' on page 5 undefined on input line 176.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/instantons.tex"] + "",
    [3, "Citation `Manton1982' on page 8 undefined on input line 3.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/moduli_space_approximation.tex"] + "",
    [21, "Citation `Weinberg:2006rq' on page 9 undefined on input line 21.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/moduli_space_approximation.tex"] + "",
    [192, "Citation `Bak:1999sv' on page 12 undefined on input line 192.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/moduli_space_approximation.tex"] + "",
    [9, "Citation `Peeters:2001np' on page 13 undefined on input line 9.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/dynamics_of_single_instanton.tex"] + "",
    [27, "Citation `Osborn:1981yf' on page 15 undefined on input line 27.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/dynamics_of_two_instantons.tex"] + "",
    [27, "Citation `Peeters:2001np' on page 15 undefined on input line 27.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/dynamics_of_two_instantons.tex"] + "",
    [20, "Citation `Osborn:1981yf' on page 22 undefined on input line 20.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/appendices.tex"] + "",
    [103, "Citation `Osborn:1981yf' on page 23 undefined on input line 103.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/appendices.tex"] + "",
    [103, "Citation `Peeters:2001np' on page 23 undefined on input line 103.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/appendices.tex"] + "",
    [352, "Citation `Peeters:2001np' on page 27 undefined on input line 352.", "compiles/d1585ce575dea4cab55f784a22a88652/sections/appendices.tex"] + ""
  ];

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message, errors[i].file] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    }
  }
});

module("Biber Warnings");

test("Biber Warning parsing", function() {
  var errors = LatexParser.parse(biberWarningsLog).warnings;

    var expectedErrors = [
    [null, 'No "backend" specified, using Biber backend. To use BibTeX, load biblatex with the "backend=bibtex" option.', "/usr/local/texlive/2013/texmf-dist/tex/latex/biblatex/biblatex.sty"] + "",
    [null, "The following entry could not be found in the database: Missing3 Please verify the spelling and rerun LaTeX afterwards.", "/compile/output.bbl"] + "",
    [null, "The following entry could not be found in the database: Missing2 Please verify the spelling and rerun LaTeX afterwards.", "/compile/output.bbl"] + "",
    [null, "The following entry could not be found in the database: Missing1 Please verify the spelling and rerun LaTeX afterwards.", "/compile/output.bbl"] + ""
  ];

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message, errors[i].file] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    } else {
      ok(false, "Unexpected error found: " + errors[i].message);
    }
  }
});

module("Natbib Warnings");

test("Natbib Warning parsing", function() {
  var errors = LatexParser.parse(natbibWarningsLog).warnings;

    var expectedErrors = [
    [6, "Citation `blah' on page 1 undefined on input line 6.", "/compile/main.tex"] + "",
    [null, "There were undefined citations.", "/compile/main.tex"] + ""
  ];

  expect(expectedErrors.length);
  for (var i = 0; i < errors.length; i++) {
    if (expectedErrors.indexOf([errors[i].line, errors[i].message, errors[i].file] + "") > -1) {
      ok(true, "Found error: " + errors[i].message);
    } else {
      ok(false, "Unexpected error found: " + errors[i].message);
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

  errors = LatexParser.parse(badBoxesLog).all;
  for (var i = 0; i < errors.length; i++) {
      equal(errors[i].file, "compiles/b6cf470376785e64ad84c57e3296c912/logs/bad-boxes.tex", "File path correct")
  }
});

});
