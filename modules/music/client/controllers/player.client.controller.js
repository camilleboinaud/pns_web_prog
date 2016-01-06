/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlayerController', ['$scope', '$state', '$window', 'Authentication', 'Music',
    function ($scope, $state, $window, Authentication, Music) {
        $scope.authentication = Authentication;

        // !!!!!! we should use function here because of something called shadow value (with the primitive value)
        $scope.getIsPaused = function () {
            return Music.getIsPaused();
        };

        $scope.getIsLoaded = function () {
            console.log('is loaded = '+Music.getIsLoaded());
            return Music.getIsLoaded();
        };

        $scope.getPlayingMusic = function () {
            return Music.getPlayingMusic();
        };

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
