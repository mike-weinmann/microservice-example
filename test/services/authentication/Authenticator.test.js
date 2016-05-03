/**
 * Authenticator unit tests
 */
 
'use strict';

const assert = require(fromBase('test/_lib/assert'));
const Authenticator = require(fromBase('services/authentication/Authenticator'));

var testUserRepository = {
    findById: function(username) {
        var user = null;
        if (username == 'validuser') {
            user = {
                name: 'validuser',
                password: 'validpassword'
            };
        }
        return Promise.resolve(user);
    }
};

/**
 * Tests
 */
module.exports = {
    authenticateValid: function() {
        var auth = new Authenticator({
            userRepository: testUserRepository
        });

        return auth.authenticate('validuser', 'validpassword')
            .then(function() {
                return true;
            });
    },

    authenticateInvalidPassword: function() {
        var auth = new Authenticator({
            userRepository: testUserRepository
        });
        return auth.authenticate('validUser', 'wrongpassword')
            .then(function() {
                throw new Error('Unexpected authentication');
            })
            .catch(function(err) {
                assert.areEqual('Invalid user', err.message, 'Invalid user check');
                return true;
            });
    },

    authenticateInvalidUser: function() {

        var auth = new Authenticator({
            userRepository: testUserRepository
        });

        return auth.authenticate('unknownuser', 'unknownpassword')
            .then(function() {
                throw new Error('Unexpected authentication');
            })
            .catch(function(err) {
                assert.areEqual('Invalid user', err.message, 'Invalid user check');
                return true;
            });
    }

};
