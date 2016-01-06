/**
 * Created by sth on 1/6/16.
 */
'use strict';
var express = require('express'),
    fs = require('fs'),
    mime = require('mime'),
    app = express();

exports.musicUpload = function(req, res) {
    console.log('############ Music Upload ############');
    var file = req.files.file,
        path = 'modules/music/client/music/upload/',
        buffer = file.buffer,
        timeStamp = Date.now(),
        fileName = path+timeStamp+'-'+file.name,
        errorMessage;
    // audio/mpeg audio/x-ms-wma audio/vnd.rn-realaudio audio/x-wav
    if(mime.lookup(file.name).indexOf('audio') != -1){
        fs.writeFile(fileName,buffer,function(error){
            if (error){
                errorMessage = 'Problem saving the file ' + file.name + '. Please try again.';
                res.status(400).send({
                    message: errorMessage
                });
                console.log(errorMessage);
                throw error;
            }
            res.jsonp({
                message: 'File saved successfully.'
            });
            console.log(fileName+' is saved!');
        });
    } else {
        errorMessage = 'File\'s mime type is not an audio.'
        res.status(400).send({
            message: errorMessage
        });
        console.log(errorMessage);
    }


};
