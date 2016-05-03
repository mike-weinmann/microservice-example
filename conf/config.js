/**
 * Simple configuration file. Dependencies are manually configured in
 * this file (instead of using a Dependency Injection framework)
 */
'use strict';

const path = require('path');

const UserFileRepository = require('../services/authentication/UserFileRepository');
const Authenticator = require('../services/authentication/Authenticator');
const SessionMemoryManager = require('../server/SessionMemoryManager');

const ConfigurationFileRepository = require('../services/configuration/ConfigurationFileRepository');
const ConfigurationService = require('../services/configuration/ConfigurationService');

const userDataFile = path.resolve(path.join(__dirname, 'data/users.json'));
const userRepository =  new UserFileRepository(userDataFile);

const sessionManager = new SessionMemoryManager();
const authenticator = new Authenticator({userRepository: userRepository});

const configurationDataFile = path.resolve(path.join(__dirname, 'data/configurations.json'));
const configurationRepository = new ConfigurationFileRepository(configurationDataFile);
const configurationService = new ConfigurationService(configurationRepository);

const ACCESS_TOKEN = 'x-access-token';

/**
 * Main configuration
 */
module.exports = {


    /**
     * HTTP server configuration
     */
    http: {
        /**
         * HTTP server port
         */
        port: 8080
    },


    /**
     * Controller configuration
     */
    controllers: {
        Authentication: {
            authenticator: authenticator,
            sessionManager: sessionManager,
            baseUrl: '/v1/auth',
            accessToken: ACCESS_TOKEN
        },
        Configuration: {
            configurationService: configurationService,
            baseUrl: '/v1/configurations'
        }
    },

    RequestAuthenticationChecker: {
        accessToken: ACCESS_TOKEN,
        sessionManager: sessionManager
    }
};
