/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlayerController', ['$scope', '$state', '$window', 'Authentication', 'Music',
    function ($scope, $state, $window, Authentication, Music) {
        $scope.authentication = Authentication;

        $scope.playingMusic = Music.getPlayingMusic();

        $scope.play = function (user) {
            // for changing the button icon from play to pause
            Music.playMusic();
        };

        $scope.pause = function (user) {
            Music.pauseMusic();
        };

        $scope.stop = function (user) {
            console.log('stop music');
        };





    }
]);
