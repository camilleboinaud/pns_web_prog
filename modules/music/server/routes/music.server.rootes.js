/**
 * Created by sth on 1/6/16.
 */
'use strict';

module.exports = function (app) {
    // User Routes
    var music = require('../controllers/music.server.controller');

    // Setting up the users profile api
    app.post('/api/music',music.musicUpload);

};
