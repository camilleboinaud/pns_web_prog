/**
 * Created by sth on 1/4/16.
 */
'use strict';

// Setting up route
// Define in which state we use which url and view

angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider
            .state('playing', {
                url: '/music',
                templateUrl: 'modules/music/views/playlist/playlist.client.view.html'
            });
    }
]);
