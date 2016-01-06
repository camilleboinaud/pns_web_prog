 /**
 * Created by sth on 1/6/16.
 */
 'use strict';

 angular.module('music').controller('MusicUploadController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
     function ($scope, $timeout, $window, Authentication, FileUploader) {
         $scope.user = Authentication.user;
         $scope.musicURL = '';

         // Create file uploader instance
         $scope.uploader = new FileUploader({
             url: 'api/music'
         });


         // Set file uploader music filter
         $scope.uploader.filters.push({
             name: 'soundFilter',
             fn: function (item, options) {
                 var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                 return '|mp3|'.indexOf(type) !== -1;
             }
         });

         // Called after the user selected a new sound file
         $scope.uploader.onAfterAddingFile = function (fileItem) {
             if ($window.FileReader) {
                 var fileReader = new FileReader();
                 fileReader.readAsDataURL(fileItem._file);

                 fileReader.onload = function (fileReaderEvent) {
                     $timeout(function () {
                         $scope.musicURL = fileReaderEvent.target.result;
                     }, 0);
                 };
             }
         };

         // Called after the user has successfully uploaded a new music
         $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
             // Show success message
             $scope.success = true;

             // Populate user object
             $scope.user = Authentication.user = response;

             // Clear upload buttons
             $scope.cancelUpload();
         };

         // Called after the user has failed to uploaded a new music
         $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
             // Clear upload buttons
             $scope.cancelUpload();

             // Show error message
             $scope.error = response.message;
         };

         // Upload music
         $scope.uploadMusic = function () {
             // Clear messages
             $scope.success = $scope.error = null;

             // Start upload
             $scope.uploader.uploadAll();
         };

         // Cancel the upload process
         $scope.cancelUpload = function () {
             $scope.uploader.clearQueue();
             //$scope.imageURL = $scope.user.profileImageURL;
         };
     }
 ]);
