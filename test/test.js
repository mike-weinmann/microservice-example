'use strict';

const path = require('path');
const TestRunner = require('./_lib/TestRunner');

/**
 * Normalizes the path to the base application directory (parent of this file)
 * This helps avoid the relative directory mess:
 *      '../../../myPackage/myModule' -> fromBase('myPackage/myModule')
 *
 * @param module Module/file name
 * @returns Application base directory + module
 */
global.fromBase = function(module) {
    return path.resolve(path.join(__dirname, '..', module));
};

//
// Tests
TestRunner.run(fromBase('test/services/FileRepository.test'));
TestRunner.run(fromBase('test/services/authentication/UserFileRepository.test'));
TestRunner.run(fromBase('test/services/authentication/Authenticator.test'));
TestRunner.run(fromBase('test/services/configuration/ConfigurationFileRepository.test'));
TestRunner.run(fromBase('test/services/configuration/ConfigurationService.test'));
TestRunner.run(fromBase('test/util/arrays.test'));
TestRunner.run(fromBase('test/server/RouteDispatcher.test'));
TestRunner.run(fromBase('test/server/SessionMemoryManager.test'));
TestRunner.run(fromBase('test/server/ListOptionParser.test'));

