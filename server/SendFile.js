'use strict';

const fs = require('fs');

module.exports = {
    /**
     * Basic send (HTML only)
     * @param fileName File name
     */
    send: function(fileName) {
        return function(req, res) {
            fs.readFile(fileName, 'utf8', function (err, content) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content);
                }
            });
        }
    }
};
