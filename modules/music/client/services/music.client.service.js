/**
 * Created by sth on 1/5/16.
 */
'use strict';

// For controlling playing music between PlayerCtr and PlaylistCtr
angular.module('music').factory('Music', ['$window',
    function ($window) {
        var me = this,
            // init audio context
            isStarted = false,
            playingMusic = {
            name:'unknown',
            cover:'default.jpg',
            url:'',
            time:{
                min:'00',
                sec:'00'
            },
            isPaused: true,
            audioBufferFromUrl:null,
            audioBufferSourceNode: null,
            startTime:0,
            lastTime:0,
            pauseTime:0, // pause duration
            offsetTime:0 // play duration
        };
        me.audioContext = initAudioContext();

        function play() {
            console.log('service play');
            playingMusic.isPaused = false;
            if(!isStarted){
                // if it is the first time, then start loading sound
                loadSound(me,playingMusic.url,function(audioBuffer){
                    // save the audioBuffer into playingMusic which we will use for resuming
                    playingMusic.audioBufferFromUrl = audioBuffer;
                    playingMusic.startTime = me.audioContext.currentTime;
                    playingMusic.lastTime = playingMusic.startTime;
                    playSoundFromAudioBuffer(audioBuffer);
                }, function(error){
                    // loadSound error callback function
                    console.log(error);
                });
                isStarted = true;
            } else {
                // It plays after pause
                if(playingMusic.audioBufferFromUrl === null){
                    console.log('Something wrong when we loaded the sound');
                } else {
                    // calculate the pause duration
                    playingMusic.pauseTime = me.audioContext.currentTime - playingMusic.lastTime;
                    playSoundFromAudioBuffer(playingMusic.audioBufferFromUrl);
                }
            }
        }

        function pause(){
            console.log('pause music');
            if(playingMusic.audioBufferSourceNode !== null){
                playingMusic.audioBufferSourceNode.stop(0);
                playingMusic.isPaused = true;
                // reset audioBufferSourceNode. Because audioBufferSourceNode.start() can only use once
                // we need recreate it from audioBuffer for the next time
                playingMusic.audioBufferSourceNode = null;
                playingMusic.lastTime = me.audioContext.currentTime;
                playingMusic.offsetTime = playingMusic.lastTime - playingMusic.startTime - playingMusic.pauseTime;
            } else {
                console.log('Something wrong when we loaded the sound');
            }
        }

        /**
         * Play sound from audioBuffer
         * @param audioBuffer
         */
        function playSoundFromAudioBuffer(audioBuffer) {
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
            audioBufferSourceNode.start(0, playingMusic.offsetTime);
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

        return {
            getPlayingMusic: function(){
                return playingMusic;
            },
            setPlayingMusic: function (music) {
                playingMusic.name = music.name;
                playingMusic.cover = music.cover;
                playingMusic.url = music.url;
                playingMusic.time = music.time;
                playingMusic.audioBufferFromUrl = null;
                if (playingMusic.audioBufferSourceNode !== null){
                    playingMusic.audioBufferSourceNode.stop(0);
                }
                playingMusic.audioBufferSourceNode = null;
                playingMusic.isPaused = true;
                playingMusic.startTime = 0;
                playingMusic.lastTime = 0;
                playingMusic.pauseTime = 0;
                playingMusic.offsetTime = 0;
                isStarted = false;
            },
            isPaused: playingMusic.isPaused,
            playMusic: play,
            pauseMusic: pause
        };
    }
]);
