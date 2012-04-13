define(function() {
    var logWrapLimit = 79;

    var LogText = function(text) {
        this.text = text.replace(/(\r\n)|\r/g, "\n");

        // Join any lines which look like they have wrapped.
        var wrappedLines = this.text.split("\n");
        this.lines = [wrappedLines[0]];
        for (var i = 1; i < wrappedLines.length; i++) {
            // If the previous line is as long as the wrap limit then 
            // append this line to it.
            // Some lines end with ... when LaTeX knows it's hit the limit
            // These shouldn't be wrapped.
            if (wrappedLines[i-1].length == logWrapLimit && wrappedLines[i-1].slice(-3) != "...") {
                this.lines[this.lines.length - 1] += wrappedLines[i];
            } else {
                this.lines.push(wrappedLines[i]);
            }
        };

        this.row = 0;
    };

    (function() {
        this.nextLine = function() {
            this.row++;
            if (this.row == this.lines.length) {
                return false;
            } else {
                return this.lines[this.row];
            }
        };

        this.rewindLine = function() {
            this.row--;
        };

        this.linesUpToNextWhitespaceLine = function() {
            return this.linesUpToNextMatchingLine(/^ *$/);
        };

        this.linesUpToNextMatchingLine = function(match) {
            var lines = [];
            var nextLine = this.nextLine();
            lines.push(nextLine);
            while (!nextLine.match(match) && nextLine !== false) {
                nextLine = this.nextLine();
                lines.push(nextLine);
            }
            return lines;
        }
    }).call(LogText.prototype);

    var state = {
        NORMAL : 0,
        ERROR  : 1
    }

    var LatexParser = function(text, options) {
        this.log = new LogText(text);
        this.state = state.NORMAL;

        options = options || {};
        this.fileBaseNames = options.fileBaseNames || [/compiles/, /\/usr\/local/];

        this.data  = [];
        this.files = [];

        this.openParens = 0;
    };

    (function() {
        this.parse = function() {
            while ((this.currentLine = this.log.nextLine()) !== false) {
                if (this.state == state.NORMAL) {
                    if (this.currentLineIsError()) {
                        this.state = state.ERROR;
                        this.currentError = {
                            line        : 0,
                            file        : this.files[this.files.length - 1],
                            level       : "error",
                            message     : this.currentLine.slice(2),
                            content     : "",
                            raw         : this.currentLine + "\n"
                        }
                    } else {
                        this.parseParensForFilenames();
                    }
                }

                if (this.state == state.ERROR) {
                    this.currentError.content += this.log.linesUpToNextMatchingLine(/^l\.[0-9]+/).join("\n");
                    this.currentError.content += "\n";
                    this.currentError.content += this.log.linesUpToNextWhitespaceLine().join("\n");
                    this.currentError.content += "\n";
                    this.currentError.content += this.log.linesUpToNextWhitespaceLine().join("\n");

                    this.currentError.raw += this.currentError.content;

                    var lineNo = this.currentError.raw.match(/l\.([0-9]+)/);
                    if (lineNo) {
                        this.currentError.line = parseInt(lineNo[1], 10);
                    }

                    this.data.push(this.currentError);
                    this.state = state.NORMAL;
                }
            }

            return this.data;
        };

        this.currentLineIsError = function() {
            return this.currentLine[0] == "!";
        };

        // Check if we're entering or leaving a new file in this line
        this.parseParensForFilenames = function() {
            var pos = this.currentLine.search(/\(|\)/);

            if (pos != -1) {
                var token = this.currentLine[pos]
                this.currentLine = this.currentLine.slice(pos + 1);

                if (token == "(") {
                    var filename = this.consumeFileName();
                    if (filename) {
                        this.files.push(filename);
                    } else {
                        this.openParens++;
                    }
                } else if (token == ")") {
                    if (this.openParens > 0) {
                        this.openParens--;
                    } else {
                        this.files.pop();
                    }
                }

                // Process the rest of the line
                this.parseParensForFilenames();
            }
        };

        this.consumeFileName = function() {
            var isFile = false;
            for (i in this.fileBaseNames) {
                // Check if any of the file base names begin the line
                if (this.currentLine.search(this.fileBaseNames[i]) == 0) {
                    isFile = true;
                    break;
                }
            }

            if (!isFile)
                return false;

            var endOfFileName = this.currentLine.search(/ |\)/);
            var filename;
            if (endOfFileName == -1) {
                filename = this.currentLine;
                this.currentLine = "";
            } else {
                filename = this.currentLine.slice(0, endOfFileName);
                this.currentLine = this.currentLine.slice(endOfFileName);
            }

            return filename;
        }
    }).call(LatexParser.prototype);

    LatexParser.parse = function(text, options) {
        return (new LatexParser(text, options)).parse()
    }

    return LatexParser;
})
