///////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2015 - ADN/Developer Technical Services
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
///////////////////////////////////////////////////////////////////////////
'use strict';

//////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.View.Upload',
  [
    'ngRoute',
  ])
  
  ///////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////
  .config(['$routeProvider', function($routeProvider) {
    
    $routeProvider.when('/upload', {
      templateUrl: './js/ui/views/upload/upload.html',
      controller: 'Autodesk.ADN.AngularView.View.Upload.Controller'
    });
  }])
  
  ///////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  .controller('Autodesk.ADN.AngularView.View.Upload.Controller',
  
  ['$scope',
    function($scope) {
      
      $scope.$parent.activeView = 'upload';
      
      $scope.$parent.showNavbar = true;
      
      
    }]);
