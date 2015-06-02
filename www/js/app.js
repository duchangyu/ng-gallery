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

//config
var configClient = require("./config-client");

// UI
require("./ui/views/home/home");
require("./ui/dialogs/about/about");
require("./ui/dialogs/embed/embed");
require("./ui/dialogs/login/login");
require("./ui/dialogs/models/models");
require("./ui/views/upload/upload");
require("./ui/views/viewer/viewer");
require("./ui/views/extensions/extensions");
require("./ui/navbars/app-navbar/app-navbar");
require("./ui/views/extension-editor/extension-editor");

// Directives
require("./directives/spinning-img-directive");

// Services
require("./services/view.and.data-service");
require("./services/extension-service");
require("./services/thumbnail-service");
require("./services/appState-service");
require("./services/toolkit-service");
require("./services/model-service");

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('ui-layout-events', [
    'ui.layout'
])
  .directive('uiLayout', function($timeout, $rootScope) {

      var methods = ['updateDisplay',
            'toggleBefore',
            'toggleAfter',
            'mouseUpHandler',
            'mouseMoveHandler'],
        timer;

      function fireEvent() {
          if(timer) $timeout.cancel(timer);
          timer = $timeout(function() {
              $rootScope.$broadcast('ui.layout.resize');
              timer = null;
          }, 0);
      }

      return {
          restrict: 'AE',
          require: '^uiLayout',
          link: function(scope, elem, attrs, uiLayoutCtrl) {
              angular.forEach(methods, function(method) {
                  var oldFn = uiLayoutCtrl[method];
                  uiLayoutCtrl[method] = function() {
                      oldFn.apply(uiLayoutCtrl, arguments);
                      fireEvent();
                  };
              });
          }
      };
  });


///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.App',
    [
        // Angular
        'ngRoute',

        // Libs
        'ui.layout',
        'ui-layout-events',
        'ngMdIcons',
        'ngResource',
        'ui.bootstrap',
        'mgcrea.ngStrap',

        // Views
        'Autodesk.ADN.AngularView.View.Home',
        'Autodesk.ADN.AngularView.View.Viewer',
        'Autodesk.ADN.AngularView.View.Upload',
        'Autodesk.ADN.AngularView.View.Extensions',
        'Autodesk.ADN.AngularView.View.ExtensionEditor',

        // UI
        'Autodesk.ADN.AngularView.Navbar.AppNavbar',
        'Autodesk.ADN.AngularView.Dialog.Models',
        'Autodesk.ADN.AngularView.Dialog.Embed',
        'Autodesk.ADN.AngularView.Dialog.Login',

        // Directives
        'Autodesk.ADN.Toolkit.UI.Directive.SpinningImg',

        //Services
        'Autodesk.ADN.AngularView.Service.Toolkit',
        'Autodesk.ADN.AngularView.Service.AppState',
        'Autodesk.ADN.Toolkit.ViewData.Service.ViewAndData',
        'Autodesk.ADN.AngularView.Service.Resource.Extension',
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .config(
      ['$routeProvider', '$locationProvider', 'ViewAndDataProvider',
          function ($routeProvider, $locationProvider, ViewAndDataProvider)
          {
              $routeProvider.otherwise({redirectTo: '/home'});

              //$locationProvider.html5Mode(true);

              ViewAndDataProvider.setTokenUrl(
                "http://" +
                window.location.host +
                configClient.host + '/api/token');
          }])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.App.Controller',
        ['$scope', '$http', 'AppState', function($scope, $http, AppState) {

            $scope.showNavbar = function() {

                return AppState.showNavbar;
            };

            requirejs.config({
                waitSeconds: 0
            });

            $scope.$on('app.onModal', function (event, data) {

                switch(data.dlgId) {

                    case '#loginDlg':

                        if(!AppState.isAuthenticated) {
                            $scope.$broadcast('app.onLogin', data);
                        }

                        break;

                    case '#aboutDlg':

                        $scope.$broadcast('app.onAbout', data);
                        break;

                    case '#modelsDlg':

                        $scope.$broadcast('app.onModels', data);
                        break;
                }
            });
        }])



