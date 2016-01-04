/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlaylistController', ['$scope', '$state', 'Authentication',
    function ($scope, $state, Authentication) {
        $scope.authentication = Authentication;

        $scope.playlist = [
            {
                name:'music 1',
                time:'4',//min
                cover:'default.jpg'
            },
            {
                name:'music 2',
                time:'5',//min
                cover:'default.jpg'
            },
            {
                name:'music 3',
                time:'6',//min
                cover:'default.jpg'
            }
        ];
    }
]);
