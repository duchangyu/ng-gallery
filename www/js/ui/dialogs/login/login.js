///////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
///////////////////////////////////////////////////////////////////////////////
'use strict';

var config = require("../../../config-client");

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.Dialog.Login',[])

  ///////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  .controller('Autodesk.ADN.AngularView.Dialog.Login.Controller',

  ['$scope', '$location', function($scope, $location) {

    $scope.onFacebookLogin = function () {

      window.location = "http://" +
        window.location.host +
        config.host + '/api/auth/facebook';
    }

    $scope.onGoogleLogin = function () {

      window.location = "http://" +
        window.location.host +
        config.host + '/api/auth/google';
    }

    $scope.onGitHubLogin = function () {

      window.location = "http://" +
      window.location.host +
      config.host + '/api/auth/github';
    }

    $scope.onLinkedInLogin = function () {

      window.location = "http://" +
      window.location.host +
      config.host + '/api/auth/linkedin';
    }

    $scope.$on('app.onLogin', function (event, data) {

      $scope.caption = data.caption;

      $('#loginDlg').modal('show');
    });

  }]);