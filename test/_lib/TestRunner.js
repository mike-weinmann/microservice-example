'use strict';

var _pendingTests = [];
var _index = 0;
var _running;
var _resolve;
var _promise = new Promise(function(resolve) {
    _resolve = resolve;
});

/**
 * Runs the tests in the module. Will run all functions in
 * the exports.
 * @param moduleName Module name
 */
function run(moduleName) {

    var module = require(moduleName);

    //store test methods in array for sequential processing
    for (var prop in module) {
        if (module.hasOwnProperty(prop) && typeof(module[prop] === 'function')) {
            _pendingTests.push({
                module: module,
                moduleName: moduleName,
                method: module[prop],
                name: prop
            });
        }
    }

    if (!_running) {
        _running = true;
        runNext();
    }
    return _promise;

}


function runNext() {
    if (_index  >= _pendingTests.length) {
        return _resolve();
    }

    var test = _pendingTests[_index];
    if (_index == 0 || _pendingTests[_index-1].moduleName != test.moduleName) {
        console.log('Running tests for: ' + test.moduleName);
    }
    console.log('  TEST: ', test.name);
    ++_index;

    try {
        var result = (test.method.bind(test.module))();
        if (result && typeof(result.then) === 'function') {
            result
                .then(function() {
                    runNext();
                }.bind(this))
                .catch(function(err) {
                    console.log('ERROR: ' + err);
                    if (err.stack) {
                        console.log(err.stack)
                    }
                    runNext();
                }.bind(this));
        }
        else {
            runNext();
        }
    }
    catch(err) {
        console.log('ERROR: ' + err);
        if (err.stack) {
            console.log(err.stack)
        }
        runNext();
    }
}

module.exports = {
    run: run
};
