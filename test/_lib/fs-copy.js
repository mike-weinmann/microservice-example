'use strict';

const fs = require('fs');

module.exports = {
    /**
     * Simple file copy (since fs.copy has moved to fs-extra)
     * @param src Source file name
     * @param dst Destination file name
     * @return Promise that is resolved after copy is completed.
     */
    copy: function(src, dst) {
        var fs = require('fs');
        return new Promise(function(resolve, reject) {
            var rd = fs.createReadStream(src);
            rd.on('error', function(err) {
                return reject(err);
            });
            var wr = fs.createWriteStream(dst);
            wr.on('error', function(err) {
                return reject(err);
            });
            wr.on('finish', resolve);
            rd.pipe(wr);
        });
    }
};
