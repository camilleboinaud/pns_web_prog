/**
 * Created by sth on 1/6/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
    require('./music/music.upload.server.controller')
);
