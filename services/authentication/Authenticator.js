'use strict';
/**
 * User authentication service
 * @param opts Options object
 * @param opts.userRepository Instance of repository of users
 *
 * @constructor
 */
function Authenticator(opts) {
    this.opts = opts;
}

/**
 * Authenticates the username and password
 * @param username User name
 * @param password User password
 * @returns Promise that resolved to user object if valid.
 */
Authenticator.prototype.authenticate = function(username, password) {
    return this.opts.userRepository.findById(username)
        .then(function (user) {
            if (!user) {
                throw new Error('Invalid user');
            }
            else {
                if (password !== user.password) {
                    throw new Error('Invalid user');
                }
                else {
                    return user;
                }
            }
        });
};

module.exports = Authenticator;
