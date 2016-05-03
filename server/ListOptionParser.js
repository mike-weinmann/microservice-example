/**
 * Utility for parsing sort/pagination options in a URL
 */
 
'use strict';

var querystring = require('querystring');

module.exports = {

    /**
     * Parses the URL for standard query parameters: sort, limit, page
     * @param url Source ULR (request object or URL)
     */
    parse:function(url) {
        if (url.url) {
            //request object, get the URL
            url = url.url;
        }
        if (!url) {
            return {};
        }

        var pos = url.indexOf('?');
        if (pos >= 0) {
            url = url.substring(pos + 1);
        }

        var opts = {};
        var parameters = querystring.parse(url);
        if (parameters.limit) {
            opts.limit = parseInt(parameters.limit);
            if (isNaN(opts.limit) || opts.limit < 0) {
                throw new Error('Invalid limit');
            }
        }
        if (parameters.start) {
            opts.start = parseInt(parameters.start);
            if (isNaN(opts.start) || opts.start < 0) {
                throw new Error('Invalid start');
            }
        }

        var sort = [];
        if (parameters.sort) {
            var sortFields = parameters.sort.split(',');
            for (var i = 0, len = sortFields.length ; i < len ; ++i) {
                var property = sortFields[i].trim();
                var order = 1;

                if (property[0] == '-') {
                    order = -1;
                    property = property.substring(1);
                }
                else if (property[0] == '+') {
                    property = property.substring(1);
                }
                sort.push({name: property, order: order});
            }
        }
        if (sort.length) {
            opts.sort = sort;
        }

        return opts;
    }
};