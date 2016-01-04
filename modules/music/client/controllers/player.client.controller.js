/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlayerController', ['$scope', '$state', 'Authentication',
    function ($scope, $state, Authentication) {
        $scope.authentication = Authentication;

        $scope.playingMusic = {
            name:'demo magic music',
            cover:'default.jpg',
            time:{
                min:'03',
                sec:'11'
            }
        };

        $scope.play = function (user) {
            console.log('play music');
        };

        $scope.pause = function (user) {
            console.log('pause music');
        };

        $scope.stop = function (user) {
            console.log('stop music');
        };
    }
]);
