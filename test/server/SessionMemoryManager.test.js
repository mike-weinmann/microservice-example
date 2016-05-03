/**
 * Dispatcher tests
 */
 
'use strict';

const assert = require(fromBase('test/_lib/assert'));
const SessionMemoryManager = require(fromBase('server/SessionMemoryManager'));

/**
 * Tests
 */
module.exports = {
    sessionLifecycle: function() {
        var mgr = new SessionMemoryManager();
        var session = mgr.create();
        assert.isDefined(session, 'Missing new session');
        var id = session._id;
        assert.isDefined(id, 'Mission session id');

        session.set('count', 4);
        var session2 = mgr.get(id);
        assert.isDefined(session2, 'Session lookup failed');
        assert.areEqual(4, session2.get('count'));

        mgr.remove(id);
        var session3 = mgr.get(id);
        assert.isNotDefined(session3, 'Deleted session still exists');
    }
};
