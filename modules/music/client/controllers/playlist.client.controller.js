/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlaylistController', ['$scope', '$state', 'Authentication', 'Music',
    function ($scope, $state, Authentication, Music) {
        $scope.authentication = Authentication;

        $scope.playlist = [
            {
                name:'Hello',
                cover:'default.jpg',
                url:'modules/music/music/Adele-Hello.mp3',
                time:{
                    min:'03',
                    sec:'00'
                },
                isPlaying: false
            },
            {
                name:'Read All About It, Pt. III',
                cover:'default.jpg',
                url:'modules/music/music/Emeli Sandé - Read All About It, Pt. III.mp3',
                time:{
                    min:'04',
                    sec:'00'
                },
                isPlaying: false
            },
            {
                name:'On Our Way',
                cover:'default.jpg',
                url:'modules/music/music/The Royal Concept - On Our Way.mp3',
                time:{
                    min:'05',
                    sec:'00'
                },
                isPlaying: false
            }
        ];
        $scope.lastIndex = 0;
        $scope.playMusic = function playMusic(index){
            console.log('click index = '+index);
            if(!$scope.playlist[index].isPlaying) {
                Music.setPlayingMusic($scope.playlist[index], function () {
                    $scope.playlist[$scope.lastIndex].isPlaying = false;
                    $scope.playlist[index].isPlaying = true;
                    $scope.lastIndex = index;
                    Music.playMusic();
                });
                console.log('Music playing = '+Music.getPlayingMusic().name);
            }

        };
    }
]);
