/**
 * Created by sth on 1/5/16.
 */
'use strict';

// For controlling playing music between PlayerCtr and PlaylistCtr
angular.module('music').factory('Music', ['$window',
    function ($window) {
        var me = this,
            Music = {},
            playingMusic;
        // init audio context
        playingMusic = {
            name:'unknown',
            cover:'default.jpg',
            url:'',
            time:{
                min:'00',
                sec:'00'
            },
            isPaused: true,
            isLoaded: false,
            isStarted: false,
            audioBufferFromUrl:null,
            audioBufferSourceNode: null,
            startTime:0,
            lastTime:0,
            pauseTime:0, // pause duration
            offsetTime:0 // play duration
        };



        /**
         * play music
         * @param callback: success callback
         */
        Music.playMusic = function play(callback) {
            if(!playingMusic.isLoaded){
                // if it is not loaded, then start loading sound
                loadSound(me,playingMusic.url,function(audioBuffer){
                    // save the audioBuffer into playingMusic which we will use for resuming
                    playingMusic.audioBufferFromUrl = audioBuffer;
                    playingMusic.isLoaded = true;
                    playSoundFromAudioBuffer(audioBuffer,callback);
                }, function(error){
                    // loadSound error callback function
                    console.log(error);
                });
            } else {
                // It plays after pause
                if(playingMusic.audioBufferFromUrl === null){
                    console.log('Something wrong when we loaded the sound');
                } else {
                    // calculate the pause duration
                    playingMusic.pauseTime = me.audioContext.currentTime - playingMusic.lastTime;
                    playSoundFromAudioBuffer(playingMusic.audioBufferFromUrl,callback);
                }
            }
        };

        /**
         * pause music
         * @param callback: success callback
         */
        Music.pauseMusic = function pause(callback){
            console.log('pause music');
            if(playingMusic.audioBufferSourceNode !== null){
                playingMusic.audioBufferSourceNode.stop(0);
                playingMusic.isPaused = true;
                // reset audioBufferSourceNode. Because audioBufferSourceNode.start() can only use once
                // we need recreate it from audioBuffer for the next time
                playingMusic.audioBufferSourceNode = null;
                playingMusic.lastTime = me.audioContext.currentTime;
                playingMusic.offsetTime = playingMusic.lastTime - playingMusic.startTime - playingMusic.pauseTime;
                if(callback) callback();
            } else {
                console.log('Something wrong when we loaded the sound');
            }
        };

        Music.getPlayingMusic = function(){
            return playingMusic;
        };

        Music.setPlayingMusic = function (music, successCallback, errorCallback) {
            if (playingMusic.audioBufferSourceNode){
                playingMusic.audioBufferSourceNode.stop(0);
            }
            playingMusic = music;
            loadSound(me,playingMusic.url,function(audioBuffer){
                // save the audioBuffer into playingMusic which we will use for resuming
                playingMusic.audioBufferFromUrl = audioBuffer;
                playingMusic.startTime = me.audioContext.currentTime;
                playingMusic.lastTime = playingMusic.startTime;
                playingMusic.isLoaded = true;
                playingMusic.isPaused = true;
                playingMusic.isStarted = false;
                playingMusic.pauseTime = 0;
                playingMusic.offsetTime = 0;
                if (successCallback) {
                    successCallback();
                }
            }, function(error){
                // loadSound error callback function
                console.log(error);
                if (errorCallback) errorCallback();
            });
        };

        Music.getIsPaused =  function() {
            return playingMusic.isPaused;
        };

        Music.getIsLoaded =  function() {
            return playingMusic.isLoaded;
        };

        /**
         * Play sound from audioBuffer
         * @param audioBuffer
         * @param callback
         */
        function playSoundFromAudioBuffer(audioBuffer,callback) {
            var audioBufferSourceNode,
                trackVolumeNode,
            // Create a single gain node for master volume
                masterVolumeNode =  me.audioContext.createGain();
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
            playingMusic.audioBufferSourceNode = audioBufferSourceNode;

            // mark start
            if(!playingMusic.isStarted){
                playingMusic.startTime = me.audioContext.currentTime;
                playingMusic.lastTime = playingMusic.startTime;
                playingMusic.isStarted = true;
            }

            // start playing
            audioBufferSourceNode.start(0, playingMusic.offsetTime);
            playingMusic.isPaused = false;
            console.log('start playing music');
            if (callback) callback();
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
        me.audioContext = initAudioContext();


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
                        console.log('Load music success');
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

        return Music;
    }
]);
