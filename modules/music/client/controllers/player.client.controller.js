/**
 * Created by sth on 1/4/16.
 */
'use strict';

angular.module('music').controller('PlayerController', ['$scope', '$state', '$window', 'Authentication',
    function ($scope, $state,$window, Authentication) {
        $scope.authentication = Authentication;

        // the music info get from db
        $scope.playingMusic = {
            name:'demo magic music',
            cover:'default.jpg',
            url:'http://kolber.github.io/audiojs/demos/mp3/juicy.mp3',
            time:{
                min:'03',
                sec:'11'
            },
            audioBufferFromUrl:null,
            audioBufferSourceNode: null,
            startTime:0,
            lastTime:0,
            pauseTime:0,
            offsetTime:0
        };

        $scope.isPaused = true;
        $scope.isStarted = false;

        $scope.play = function (user) {
            // for changing the button icon from play to pause
            $scope.isPaused = false;
            // init audio context
            if($scope.audioContext === undefined){
                $scope.audioContext = initAudioContext();
            }

            if(!$scope.isStarted){
                // if it is the first time, then start loading sound
                loadSound($scope,$scope.playingMusic.url,function(audioBuffer){
                    // save the audioBuffer into playingMusic which we will use for resuming
                    $scope.playingMusic.audioBufferFromUrl = audioBuffer;
                    $scope.playingMusic.startTime = $scope.audioContext.currentTime;
                    $scope.playingMusic.lastTime = $scope.playingMusic.startTime;
                    playSoundFromAudioBuffer($scope,audioBuffer);
                }, function(error){
                    // loadSound error callback function
                    console.log(error);
                });
                $scope.isStarted = true;
            } else {
                // It plays after pause
                if($scope.playingMusic.audioBufferFromUrl == null){
                    console.log("Something wrong when we load the sound");
                } else {
                    $scope.playingMusic.pauseTime = $scope.audioContext.currentTime - $scope.playingMusic.lastTime;
                    playSoundFromAudioBuffer($scope,$scope.playingMusic.audioBufferFromUrl);
                }
            }
        };

        $scope.pause = function (user) {
            console.log('pause music');
            if($scope.playingMusic.audioBufferSourceNode != null){
                $scope.playingMusic.audioBufferSourceNode.stop(0);
                // reset audioBufferSourceNode. Because audioBufferSourceNode.start() can only use once
                // we need recreate it from audioBuffer for the next time
                $scope.playingMusic.audioBufferSourceNode = null;
                $scope.playingMusic.lastTime = $scope.audioContext.currentTime;
                $scope.playingMusic.offsetTime = $scope.playingMusic.lastTime - $scope.playingMusic.startTime - $scope.playingMusic.pauseTime;
                $scope.isPaused = true;
            } else {
                console.log("Something wrong when we loaded the sound");
            }
        };

        $scope.stop = function (user) {
            console.log('stop music');
        };

        /**
         * Play sound from audioBuffer
         * @param me: the context
         * @param audioBuffer
         */
        function playSoundFromAudioBuffer(me, audioBuffer) {
            var audioBufferSourceNode,
                trackVolumeNode,
                // Create a single gain node for master volume
                masterVolumeNode =  $scope.audioContext.createGain();
            // loadSound success callback function
            audioBufferSourceNode = me.audioContext.createBufferSource();
            audioBufferSourceNode.buffer = audioBuffer;
            // Connect the sound sample to its volume node
            trackVolumeNode = me.audioContext.createGain();
            audioBufferSourceNode.connect(trackVolumeNode);

            // Connects track volume node a single master volume node
            trackVolumeNode.connect(masterVolumeNode);
            masterVolumeNode.connect(me.audioContext.destination);
            // playing sound (when, offset, duration)
            $scope.playingMusic.audioBufferSourceNode = audioBufferSourceNode;
            audioBufferSourceNode.start(0, $scope.playingMusic.offsetTime);
            console.log('play music');
        }

        /**
         * Initialise the Audio Context
         * @returns the Audio Context
         */
        function initAudioContext() {
            // There can be only one!
            var AudioContext = $window.AudioContext || $window.webkitAudioContext,
                ctx = new AudioContext();

            if(ctx === undefined) {
                throw new Error('AudioContext is not supported. :(');
            }
            return ctx;
        }


        /**
         * Load sound from url
         * @param loader
         * @param url
         * @param successCallback
         * @param errorCallback
         */
        function loadSound(loader, url, successCallback, errorCallback) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                loader.audioContext.decodeAudioData(
                    request.response,
                    function(audioBuffer) {
                        if (!audioBuffer) {
                            alert('error decoding file data: ');
                            return;
                        }
                        console.log('In bufferLoader.onload bufferList size is ');
                        successCallback(audioBuffer);
                    },
                    function(error) {
                        console.error('decodeAudioData error', error);
                    }
                );
            };
            request.onprogress = function(e) {
                //console.log("loaded : " + e.loaded + " total : " + e.total);
            };
            request.onerror = errorCallback;
            request.send();
        }

    }
]);
