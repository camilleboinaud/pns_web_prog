/**
 * Created by sth on 1/4/16.
 */
'use strict';

// Setting up route
// Define in which state we use which url and view

angular.module('music').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider
            .state('musicStop', {
                url: '/music',
                templateUrl: 'modules/music/views/playlist/playlist.client.view.html'
            })
            .state('uploadMusic', {
                url: '/music/upload',
                templateUrl: 'modules/music/views/upload-music.client.view.html'
            });
    }
]);
