/**
 * Created by sth on 1/6/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require(path.resolve('./config/config')),
    bodyParser = require('body-parser');

/**
 * Module init function.
 */
module.exports = function (app, db) {

    // change Express's request size limitation
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

};
