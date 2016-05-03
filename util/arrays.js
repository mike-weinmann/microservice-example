/**
 * Helper functions for manipulating arrays--similar to methods found in
 * libraries like underscore and lodash
 */
'use strict';

module.exports = {
    /**
     * Sorts the source array by the value of the properties.
     * If multiple sort properties are supplied, then those are
     * used as secondary sorts.
     *
     * Each property can be a simple string of the property name
     * or an object with a "name" and "order" property. Valid
     * values for "order" are -1 for descending and 1 for ascending.
     * Any other values are treated as ascending
     *
     * This is backed by Array.sort, so the original is modified
     * @param src Source array
     * @param props Sort properties
     * @return Original array (with elements sorted)
     */
    sort: function(src, props) {

        var startIndex;
        if (props instanceof Array) {
            //props is an array of sort fields
            startIndex = 0;
        }
        else {
            //variable arguments of sort fields
            props = arguments;
            startIndex = 1;
        }
        var comparisons = [];
        for (var i = startIndex, len = props.length ; i < len ; ++i) {
            var prop = props[i];
            var name;
            var order;
            if (typeof(prop) === 'string') {
                name = prop;
                order = 1;
            }
            else {
                name = prop.name;
                order = prop.order == -1 ? -1 : 1;
            }

            comparisons.push(this._createComparison(name, order));
        }

        src.sort(function(a,b) {
            for (var i = 0, len = comparisons.length; i < len ; ++i) {
                var cmp = comparisons[i];
                var val = cmp(a,b);
                if (val !== 0) {
                    return val;
                }
            }
            return 0;
        });
        return src;
    },

    /**
     * Creates a comparison function for a property and sort order
     * (used to create proper closure when building comparison methods)
     * @param name
     * @param order
     * @returns {function(this:exports)}
     * @private
     */
    _createComparison: function(name, order) {
        return function(a, b) {
            return this.compare(a[name], b[name]) * order;
        }.bind(this);
    },

    /**
     * Compares the objects (using sort semantics)
     * @param a
     * @param b
     * @return negative if a < b, positive if a > b, 0 if a == b
     */
    compare: function(a, b) {
        if (a == null) {
            return b == null ? 0 : -1;
        }
        else if (b == null) {
            return 1;
        }
        else {
            if (this.isNumber(a) && this.isNumber(b)) {
                return a - b;
            }
            else if (this.isDate(a) && this.isDate(b)) {
                return a - b;
            }
            else {
                return a.toString().localeCompare(b.toString());
            }

        }
    },

    /**
     * Determines if object is a number (primitive or Number instance)
     * @param x Value to check
     * @returns {boolean} true if number.
     */
    isNumber: function(x) {
        return x instanceof Number || typeof(x) === 'number';
    },

    /**
     * Determines if object a Date instance
     * @param x
     * @returns {boolean} true, if date
     */
    isDate: function(x) {
        return x instanceof Date
    }


};